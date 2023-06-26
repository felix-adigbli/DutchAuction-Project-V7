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
//import Web3 from 'web3';



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
  const [greeterContract, setGreeterContract] = useState<Contract | null>(null);
 // const [dutchAuctionContract, setDutchAuctionContract] = useState<Contract>();
  const [greeterContractAddr, setGreeterContractAddr] = useState<string>('');
 // const [greeting, setGreeting] = useState<string| null>(null);
//  const [greetingInput, setGreetingInput] = useState<string>('');
  const [reservePriceInput, setReservePriceInput] = useState<BigNumber | null>(null);
  const [numBlocksAuctionOpenInput, setnumBlocksAuctionOpenInput] = useState<BigNumber| null>(null);
  const [offerPriceDecrementInput, setofferPriceDecrementInput] = useState<BigNumber | null>(null);
  const [auctionLookupInput, setAuctionLookInput] = useState<string>('');
 // const [lookupAuctionCurrentPrice, setlookupAuctionCurrentPrice] = useState<any>(null);
  const [bidAmmountInput, setBidAmountInput] = useState<string>();
  const [bidAddressInput, SetBidAddressInput] = useState<string>('');  
 // const [auctionReservePrice,  setAuctionReservePrice] = useState<any>('');
  //const [auctionNumBlockOpen, setAuctionNumBlockOpen] = useState<any>('');
  //const [auctionPriceDecrement, setAuctionPriceDecrement] = useState<any>('');
  //const [auctionWiner, setAuctionWiner] = useState<any>('');
 // const [auctionCurrentPrice, setActionCurrentPrice] = useState<any>('');

  

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);
/*
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
*/
  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    
    // only deploy the Greeter contract one time, when a signer is defined
    if (greeterContract || !signer) {
      return;
    }

    setGreeterContract(null);
    //setGreeting(null);

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
        //setGreeting(dutchAuctionContract.address);
        //setGreeterContract(greeterContract);
        //setGreeting(greeting);

        window.alert(`Dutch Auction deployed to: ${dutchAuctionContract.address}`)
        // window.alert(`Greeter deployed to: ${greeterContract.address}`);

        setGreeterContractAddr(dutchAuctionContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      } finally {
        setReservePriceInput(BigNumber.from(' '));
        setnumBlocksAuctionOpenInput(BigNumber.from(' '));
        setofferPriceDecrementInput(BigNumber.from(' '));
        setGreeterContract(null);
      }
    }

    deployDuctAuctContract(signer);
  }

 // function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
 //   event.preventDefault();
  //  setGreetingInput(event.target.value);
  //}


  function handleAuctionLookup(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAuctionLookInput(event.target.value);
  }

  function handleReservePriceInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    const reservePriceInputBigNumber = BigNumber.from(event.target.value);
    setReservePriceInput(reservePriceInputBigNumber);
  }
  
  function handleNumBlockOpenInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    const numberOfBlockBigNumber = BigNumber.from(event.target.value);
    setnumBlocksAuctionOpenInput(numberOfBlockBigNumber);
  }

  function handleOfferPriceDecInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    const offerPriceDecInputBigNumber = BigNumber.from(event.target.value);
    setofferPriceDecrementInput(offerPriceDecInputBigNumber);
  }

  function handleBidAmountInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setBidAmountInput(event.target.value);
  }

  function handleBidAddressInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    SetBidAddressInput(event.target.value);
  }



  //****** */


//connect using ether.js

async function sendContractRequest() {
  // Check if MetaMask is installed
  const windowCopy: any = window;
  if (!windowCopy.ethereum) {
    console.error('MetaMask is not installed.');
    return;
  }

  // Request access to the user's MetaMask account
  await windowCopy.ethereum.request({ method: 'eth_requestAccounts' });

  // Connect to the Ethereum network using MetaMask
  const provider = new ethers.providers.Web3Provider(windowCopy.ethereum);

  // Get the signer from the provider
  const signer = provider.getSigner();


  // Create a new contract instance
  const contractInfo =  new ethers.Contract(auctionLookupInput, DutchAuctionArtifact.abi, signer);
  //const contractInfo = new ethers.Contract(auctionLookupInput, DutchAuctionArtifact.abi);


async function getCurrentPrice(): Promise<any> {
  try {
    const auctionCurrentPrice = await contractInfo.getCurrentPrice();
    return auctionCurrentPrice.data;
  } catch (error) {
    console.error('Error calling contract method:', error);
    throw error;
  }
}

  try {
    // Call a contract method that doesn't modify state (view/pure)
  

    // Process the result
    //console.log('Contract method result:', result);
    const auctionReservePrice = await contractInfo.reservePrice();
     //setAuctionReservePrice(await contractInfo.reservePrice());
     //setAuctionNumBlockOpen(await contractInfo.numBlocksAuctionOpen());   
     const auctionNumBlockOpen =  await contractInfo.numBlocksAuctionOpen();
      //setAuctionPriceDecrement(await contractInfo.offerPriceDecrement());
      const auctionPriceDecrement = await contractInfo.offerPriceDecrement();
      //setAuctionWiner(await contractInfo.getBidWinner());
      const auctionWiner = await contractInfo.getBidWinner();
      //setActionCurrentPrice(await contractInfo.getCurrentPrice());
      const auctionCurrentPrice = parseInt(await getCurrentPrice());
      console.log({auctionCurrentPrice});
      console.log ({auctionNumBlockOpen});
      console.log({auctionPriceDecrement});
      console.log({auctionReservePrice});
      console.log({auctionWiner});
      //window.alert(`return result  ${await contractInfo.reservePrice()}` )
      
      window.alert(`currentPrice: ${auctionCurrentPrice} \n number of block open: ${auctionNumBlockOpen} \n Price Decrement: ${auctionPriceDecrement}\n Reserve Price: ${auctionReservePrice} \n Bid Winner: ${auctionWiner}`);
   
    
    // Send a transaction to a contract method that modifies state
   /* const transaction = await contract.yourContractMethod(arg1, arg2)
      .connect(signer)
      .send();

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    
    // Process the receipt
    console.log('Transaction receipt:', receipt);
    */
  } catch (error: any) {
          
  console.error('Transaction error:', error);
  window.alert('Error!' + (error && error.message ? `\n\n${error.message}` : '')
          )
        }
}

async function bidRequest() {
  // Check if MetaMask is installed
  const windowCopy: any = window;
  if (!windowCopy.ethereum) {
    console.error('MetaMask is not installed.');
    return;
  }

  // Request access to the user's MetaMask account
  await windowCopy.ethereum.request({ method: 'eth_requestAccounts' });

  // Connect to the Ethereum network using MetaMask
  const provider = new ethers.providers.Web3Provider(windowCopy.ethereum);

  // Get the signer from the provider
  const signer = provider.getSigner();

   // Create a new contract instance
  const contractInfo =  new ethers.Contract(bidAddressInput, DutchAuctionArtifact.abi, signer);
  //const contractInfo = new ethers.Contract(auctionLookupInput, DutchAuctionArtifact.abi);

  try {
    const transaction = await contractInfo.placeBid({value:bidAmmountInput});
    
  /* const transaction = await contract.yourContractMethod(arg1, arg2)
      .connect(signer)
      .send();*/

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    
    // Process the receipt
    console.log('Transaction receipt:', receipt);
    window.alert(`Transaction Successfull. Bidwinner!`)
    
  } catch (error: any) {
          
  console.error('Transaction error:', error);
  window.alert('Error!' + (error && error.message ? `\n\n${error.message}` : '')
          )
        }
}
// Call the function to send the contract request
//sendContractRequest();


  //handleBidSubmit
/*
  function handleAuctionLookupSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();


    if (!auctionLookupInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    
    const windowCopy: any = window;
    const host = windowCopy.ethereum;
    const web3 = new Web3(host);

    // Create an instance of the smart contract using the ABI and address
    const contractInfo = new web3.eth.Contract(DutchAuctionArtifact.abi, auctionLookupInput);

    async function getAuctionInfo(): Promise<void> {
      setlookupAuctionCurrentPrice(null);

      try {

       setAuctionReservePrice(await contractInfo.methods.reservePrice().call());
       setAuctionNumBlockOpen(await contractInfo.methods.numBlocksAuctionOpen().call());      
       setAuctionPriceDecrement(await contractInfo.methods.offerPriceDecrement().call());
       setAuctionWiner(await contractInfo.methods.getBidWinner().call());
       setActionCurrentPrice(await contractInfo.methods.getCurrentPrice().call());
       console.log({auctionCurrentPrice});
       console.log ({auctionNumBlockOpen});
       console.log({auctionPriceDecrement});
       console.log({auctionReservePrice});
       console.log({auctionWiner});
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

    const windowCopy: any = window;
    const host = windowCopy.ethereum;
    const web3 = new Web3(host);


    // Create an instance of the smart contract using the ABI and address
    const contractInfo = new web3.eth.Contract(DutchAuctionArtifact.abi, bidAddressInput);

    // Get the current Ethereum accounts from MetaMask
    web3.eth.getAccounts()
      .then(async ([senderAddress]) => {
        // Specify the value to send in wei
        //const valueToSend = '100000'; // 10 wei

        try {
          // Call the contract function and send the transaction
          const transaction = contractInfo.methods.placeBid().call({
            from: senderAddress,
            value: bidAmmountInput
          });

        getEvents();

          // Wait for the transaction to be mined
          const receipt = await transaction;

          console.log('Transaction receipt:', receipt);
          console.log('Transaction confirmed');
        } catch (error: any) {
          
          console.error('Transaction error:', error);
          window.alert(
              'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          )
        }
      })
      .catch((error) => {
        console.error('Error retrieving accounts:', error);
      });
window.alert('Bid sunmiteed successfully');

  }

  const windowCopy: any = window;
    const host = windowCopy.ethereum;
    const web3 = new Web3(host);

    // Create an instance of the smart contract using the ABI and address
    const contract = new web3.eth.Contract(DutchAuctionArtifact.abi, auctionLookupInput);

    async function getEvents() {
    const dutchevents = await contract.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
 // same results as the optional callback above
});
    await getTransferDetails(dutchevents);
};



async function getTransferDetails(data_events: any[]) {
  const web3 = new Web3();
  for (let i = 0; i < data_events.length; i++) {
    const from = data_events[i]['returnValues']['from'];
    const to = data_events[i]['returnValues']['to'];
    const amount = data_events[i]['returnValues']['amount'];
    const converted_amount = web3.utils.fromWei(amount, 'Mwei');

    if (parseFloat(converted_amount) > 0) {
      console.log("From:", from, "- To:", to, "- Value:", converted_amount);
    }
  }
}
*/

//getEvents();


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
          onClick={sendContractRequest}
        >
          Submit Lookup
        </StyledButton>

        <StyledLabel>Contract Address</StyledLabel>
        <div>
          {auctionLookupInput ? (
            auctionLookupInput
          ) : (
              <em>{`<No Contract lookup yet>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>

        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>

        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>

        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>

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
        onClick={bidRequest}
      >
        Submit Bid
      </StyledButton>

    </>
  );

}
