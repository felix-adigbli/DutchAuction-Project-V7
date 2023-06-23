import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import DutchAuctionArtifact from '../artifacts/contracts/dutchauction.sol/DutchAuction.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';
import React from 'react';
import Web3 from 'web3';


const StyledDeployContractButton = styled.button`
  width: 220px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function Greeter(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;
  const [signer, setSigner] = useState<Signer>();
  const [greeterContract, setGreeterContract] = useState<Contract>();
  const [dutchAuctionContract, setDutchAuctionContract] = useState<Contract>();
  const [greeterContractAddr, setGreeterContractAddr] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [greetingInput, setGreetingInput] = useState<string>('');
  const [reservePriceInput, setReservePriceInput] = useState<BigNumber>();
  const [numBlocksAuctionOpenInput, setnumBlocksAuctionOpenInput] = useState<BigNumber>();
  const [offerPriceDecrementInput, setofferPriceDecrementInput] = useState<BigNumber>();
  const [auctionLookupInput, setAuctionLookInput] = useState<string>('');
  const [lookupAuctionCurrentPrice, setlookupAuctionCurrentPrice] = useState(null);
  const [bidAmmountInput, setBidAmountInput] = useState<BigNumber>();
  const [bidAddressInput, SetBidAddressInput] = useState<string>('');
  //const [auctionReservePrice, setAuctionReservePrice]  = useState<BigNumber>();
  let auctionReservePrice;
  let auctionNumBlockOpen;
  let auctionPriceDecrement;
  let auctionWiner;
  let auctionCurrentPrice;




  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!greeterContract) {
      return;
    }

    async function getGreeting(greeterContract: Contract): Promise<void> {
      const _greeting = await greeterContract.greet();

      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(greeterContract);
  }, [greeterContract, greeting]);

  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the Greeter contract one time, when a signer is defined
    if (greeterContract || !signer) {
      return;
    }

    async function deployDuctAuctContract(signer: Signer): Promise<void> {


      const DutchAuction = new ethers.ContractFactory(
        DutchAuctionArtifact.abi,
        DutchAuctionArtifact.bytecode,
        signer
      );

      try {

        const dutchAuctionContract = await DutchAuction.deploy(
          reservePriceInput,
          numBlocksAuctionOpenInput,
          offerPriceDecrementInput
        );
        await dutchAuctionContract.deployed();

        // const greeting = await greeterContract.greet();

        setGreeterContract(dutchAuctionContract);
        setGreeting(dutchAuctionContract.address);

        //setGreeterContract(greeterContract);
        //setGreeting(greeting);

        window.alert(`Dutch Auction deployed to: ${dutchAuctionContract.address}`)
        // window.alert(`Greeter deployed to: ${greeterContract.address}`);

        setGreeterContractAddr(dutchAuctionContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployDuctAuctContract(signer);
  }

  function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }


  function handleAuctionLookup(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAuctionLookInput(event.target.value);
  }

  function handleReservePriceInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setReservePriceInput(event.target.value);
  }
  function handleNumBlockOpenInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setnumBlocksAuctionOpenInput(event.target.value);
  }
  function handleOfferPriceDecInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setofferPriceDecrementInput(event.target.value);
  }

  function handleBidAmountInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setBidAmountInput(event.target.value);
  }

  function handleBidAddressInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    SetBidAddressInput(event.target.value);
  }


  function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!greeterContract) {
      window.alert('Undefined greeterContract');
      return;
    }

    if (!auctionLookupInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(greeterContract: Contract): Promise<void> {
      try {
        const setGreetingTxn = await greeterContract.setGreeting(greetingInput);

                await setGreetingTxn.wait();

        const newGreeting = await greeterContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        if (newGreeting !== greeting) {
          setGreeting(newGreeting);
        }
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitGreeting(greeterContract);
  }

  //****** */

  handleBidSubmit

  function handleAuctionLookupSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();


    if (!auctionLookupInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    const host = 'http://127.0.0.1:8545/'
    const web3 = new Web3(host);


    // Create an instance of the smart contract using the ABI and address
    const contractInfo = new web3.eth.Contract(DutchAuctionArtifact.abi, auctionLookupInput);

    async function getAuctionInfo(): Promise<void> {
      try {

        auctionReservePrice = await contractInfo.methods.reservePrice().call();
       auctionNumBlockOpen = await contractInfo.methods.numBlocksAuctionOpen().call();      
       auctionPriceDecrement = await contractInfo.methods.offerPriceDecrement().call();
        auctionWiner = await contractInfo.methods.getBidWinner().call();
       auctionCurrentPrice = await contractInfo.methods.getCurrentPrice().call();
       console.log('current prince :', auctionCurrentPrice);
       console.log (auctionNumBlockOpen);
       console.log(auctionPriceDecrement);
       console.log(auctionReservePrice);
       console.log(auctionWiner);
       window.alert(`currentPrice: ${auctionCurrentPrice} \n number of block open: ${auctionNumBlockOpen} \n Price Decrement: ${auctionPriceDecrement}\n Reserve Price: ${auctionReservePrice} \n Bid Winner: ${auctionWiner}`);
   


      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    getAuctionInfo();

  }

  

  function handleBidSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    const host = 'http://127.0.0.1:8545/'
    const web3 = new Web3(host);


    // Create an instance of the smart contract using the ABI and address
    const contractInfo = new web3.eth.Contract(DutchAuctionArtifact.abi, bidAddressInput);
     async function submitBid(): Promise<void> {
      try {
     

      const placeBid = await contractInfo.methods.placeBid({value: bidAmmountInput }).call();
    
        window.alert('Bid Submited Successfully');

      } catch (error: any) {
        if (error.message.includes('Bid has Expired')) {
          console.log('Bid has expired');
          window.alert('Bid has expired');
        } else {
          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          );
        }
        
      }
    }

    submitBid();

  }


  //****** */

  return (
    <>
      <h1>Deploy A Dutch Auction</h1>
      <StyledLabel htmlFor="reservePriceInput">Reserve Price</StyledLabel>
      <StyledInput
        id="reservePriceInput"
        type="text"
        placeholder={bidAmmountInput ? '' : 'Enter Reserve Price here'}
        onChange={handleReservePriceInput}
        style={{ fontStyle: bidAmmountInput ? 'normal' : 'italic' }}
      ></StyledInput>
      <StyledLabel htmlFor="numBlocksAuctionOpenInput">Number of Blocks Open</StyledLabel>
      <StyledInput
        id="numBlocksAuctionOpenInput"
        type="text"
        placeholder={bidAmmountInput ? '' : 'Enter  Number of block open here'}
        onChange={handleNumBlockOpenInput}
        style={{ fontStyle: bidAmmountInput ? 'normal' : 'italic' }}
      ></StyledInput>
      <StyledLabel htmlFor="offerPriceDecrementInput">Offer Price Decrement</StyledLabel>
      <StyledInput
        id="offerPriceDecrementInput"
        type="text"
        placeholder={bidAddressInput ? '' : 'Enter offer price decrement here'}
        onChange={handleOfferPriceDecInput}
        style={{ fontStyle: bidAddressInput ? 'normal' : 'italic' }}
      ></StyledInput>
   
      <StyledGreetingDiv>
       
        <StyledDeployContractButton
          disabled={!active || greeterContract ? true : false}
          style={{
            cursor: !active || greeterContract ? 'not-allowed' : 'pointer',
            borderColor: !active || greeterContract ? 'unset' : 'blue'
          }}
          onClick={handleDeployContract}
        >
          Deploy Contract
        </StyledDeployContractButton>
      </StyledGreetingDiv>
      <StyledLabel>Deployed Contract address</StyledLabel>
      <div>
        {greeterContractAddr ? (
          greeterContractAddr
        ) : (
          <em>{`<Contract not yet deployed>`}</em>
        )}
      </div>
      <SectionDivider />
      <h1>Look up info on an auction</h1>
      <StyledGreetingDiv>
        
        <StyledLabel htmlFor="auctionLookupInput">Auction Address</StyledLabel>
        <StyledInput
          id="auctionLookupInput"
          type="text"
          placeholder={auctionLookupInput ? '' : 'Enter Auction Address here'}
          onChange={handleAuctionLookup}
          style={{ fontStyle: auctionLookupInput ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !auctionLookupInput ? true : false}
          style={{
            cursor: !active || !auctionLookupInput ? 'not-allowed' : 'pointer',
            borderColor: !active || !auctionLookupInput ? 'unset' : 'blue'
          }}
          onClick={handleAuctionLookupSubmit}
        >
          Submit
        </StyledButton>

        <StyledLabel>Contract Address</StyledLabel>
        <div>
          {auctionLookupInput ? (
            auctionLookupInput
          ) : (
              <em>{`<No Auction lookup yet>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Reserve Price</StyledLabel>
        <div>
          {lookupAuctionCurrentPrice ? (lookupAuctionCurrentPrice) : (<em>{`<No Auction lookup yet>`}</em>)}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>

      </StyledGreetingDiv>


      <SectionDivider />
      <h1>Submit Bid Section</h1>
      <StyledLabel htmlFor="bidAmountInput">Bid Amount</StyledLabel>
      <StyledInput
        id="bidAmountInput"
        type="text"
        placeholder={bidAmmountInput ? '' : 'Enter Bid amount here'}
        onChange={handleBidAmountInput}
        style={{ fontStyle: bidAmmountInput ? 'normal' : 'italic' }}
      ></StyledInput>
      <StyledLabel htmlFor="bidAddressInput">Auction Address</StyledLabel>
      <StyledInput
        id="bidAddressInput"
        type="text"
        placeholder={bidAddressInput ? '' : 'Enter Auction Address here'}
        onChange={handleBidAddressInput}
        style={{ fontStyle: bidAddressInput ? 'normal' : 'italic' }}
      ></StyledInput>
      <StyledButton
        disabled={!active || !bidAmmountInput ? true : false}
        style={{
          cursor: !active || !bidAmmountInput ? 'not-allowed' : 'pointer',
          borderColor: !active || bidAmmountInput ? 'unset' : 'blue'
        }}
        onClick={handleBidSubmit}
      >
        Submit Bid
      </StyledButton>

    </>
  );

}
