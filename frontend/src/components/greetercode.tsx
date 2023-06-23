import { useWeb3React } from '@web3-react/core'; // Import the useWeb3React hook for accessing the Web3 context
import { Contract, ethers, Signer } from 'ethers'; // Import Contract and ethers for interacting with Ethereum contracts
import {
    ChangeEvent,
    MouseEvent,
    ReactElement,
    useEffect,
    useState
} from 'react'; // Import React dependencies
import styled from 'styled-components'; // Import styled-components for styling
import DutchAuctionArtifact from '../artifacts/contracts/dutchauction.sol/DutchAuction.json'; // Import the JSON artifact of the DutchAuction contract
import { Provider } from '../utils/provider'; // Import the Provider component for web3-react
import { SectionDivider } from './SectionDivider'; // Import the SectionDivider component

// Define a styled component for the "Deploy Contract" button
const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

// Define a styled component for the greeting section
const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

// Define a styled component for labels
const StyledLabel = styled.label`
  font-weight: bold;
`;

// Define a styled component for input fields
const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

// Define a styled component for buttons
const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

// Define the Greeter component
export function Greeter(): ReactElement {
    const context = useWeb3React<Provider>(); // Access the Web3 context using the useWeb3React hook
    const { library, active } = context; // Retrieve the library and active status from the context

    const [signer, setSigner] = useState<Signer>(); // Define a state variable for the signer
    const [greeterContract, setGreeterContract] = useState<Contract>(); // Define a state variable for the greeterContract
    const [greeterContractAddr, setGreeterContractAddr] = useState<string>(''); // Define a state variable for the greeterContract address
    const [greeting, setGreeting] = useState<string>(''); // Define a state variable for the greeting
    const [greetingInput, setGreetingInput] = useState<string>(''); // Define a state variable for the input field value

    // Update the signer when the library value changes
    useEffect((): void => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    // Fetch the current greeting when the greeterContract changes
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

    // Handle the deploy contract button click event
    function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        // Only deploy the Greeter contract one time, when a signer is defined
        if (greeterContract || !signer) {
            return;
        }

        async function deployGreeterContract(signer: Signer): Promise<void> {
            const Greeter = new ethers.ContractFactory(
                DutchAuctionArtifact.abi,
                DutchAuctionArtifact.bytecode,
                signer
            );

            try {
                const greeterContract = await Greeter.deploy('Hello, Hardhat!');

                await greeterContract.deployed();

                const greeting = await greeterContract.greet();

                setGreeterContract(greeterContract);
                setGreeting(greeting);

                window.alert(`Greeter deployed to: ${greeterContract.address}`);

                setGreeterContractAddr(greeterContract.address);
            } catch (error: any) {
                window.alert(
                    'Error!' + (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        deployGreeterContract(signer);
    }

    // Handle the greeting input change event
    function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        setGreetingInput(event.target.value);
    }

    // Handle the greeting submit button click event
    function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();

        if (!greeterContract) {
            window.alert('Undefined greeterContract');
            return;
        }

        if (!greetingInput) {
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
    

    return (
        <>
            <StyledLabel htmlFor="greetingInput">Set new greeting</StyledLabel>
            <StyledInput
                id="greetingInput"
                type="text"
                placeholder={greeting ? '' : '<Contract not yet deployed>'}
                onChange={handleGreetingChange}
                style={{ fontStyle: greeting ? 'normal' : 'italic' }}
            ></StyledInput>
            {/* Render the Deploy Contract button */}
            <StyledDeployContractButton
                disabled={!active || greeterContract ? true : false}
                style={{
                    cursor: !active || greeterContract ? 'not-allowed' : 'pointer',
                    borderColor: !active || greeterContract ? 'unset' : 'blue'
                }}
                onClick={handleDeployContract}
            >
                Deploy Greeter Contract
            </StyledDeployContractButton>
            <SectionDivider />
            {/* Render the greeting section */}
            <StyledGreetingDiv>
                <StyledLabel>Contract addr</StyledLabel>
                <div>
                    {greeterContractAddr ? (
                        greeterContractAddr
                    ) : (
                        <em>{`<Contract not yet deployed>`}</em>
                    )}
                </div>
                <div></div>
                <StyledLabel>Current greeting</StyledLabel>
                <div>
                    {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>}
                </div>
                <div></div>
                <StyledLabel htmlFor="greetingInput">Set new greeting</StyledLabel>
                <StyledInput
                    id="greetingInput"
                    type="text"
                    placeholder={greeting ? '' : '<Contract not yet deployed>'}
                    onChange={handleGreetingChange}
                    style={{ fontStyle: greeting ? 'normal' : 'italic' }}
                ></StyledInput>
                <StyledButton
                    disabled={!active || !greeterContract ? true : false}
                    style={{
                        cursor: !active || !greeterContract ? 'not-allowed' : 'pointer',
                        borderColor: !active || !greeterContract ? 'unset' : 'blue'
                    }}
                    onClick={handleGreetingSubmit}
                >
                    Submit
                </StyledButton>
            </StyledGreetingDiv>
        </>
    );
}
