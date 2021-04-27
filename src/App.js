import { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import Counter from './build/contracts/Counter';
import './App.css';

// TODO:
// - I can connect to my MetaMask wallet and see my address and balance ✅
// - I can increment the counter ✅
// - I can decrement the counter ✅
// - I can get the count ✅

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [count, setCount] = useState(null);
  const [counter, setCounter] = useState(0);
  const [decLoading, setDecLoading] = useState(false);
  const [incLoading, setIncLoading] = useState(false);

  // retrieves and sets the account balance
  const setAccountBalance = async () => {
    if (web3) {
      console.log('Setting balance...');
      const newBalance = await web3.eth.getBalance(account);
      setBalance(newBalance);
    }
  };

  useEffect(() => {
    const loadBlockchain = async () => {
      // make sure the wallet exists
      if (typeof window.ethereum !== 'undefined') {
        // create new web3 connection
        const web3 = new Web3(window.web3.currentProvider);
        // enable it to prevent error
        await window.ethereum.enable();
        // get network ID for use later
        const netId = await web3.eth.net.getId();
        // get accounts - destructured to make this a 1 liner instead of 2.
        const [account] = await web3.eth.getAccounts();
        // get account balance
        const balance = await web3.eth.getBalance(account);
        // Set our values to state so we can use them throughout the app
        if (typeof account !== 'undefined') {
          setAccount(account);
          setWeb3(web3);
          setBalance(balance);
        }
        // Try to deploy the contract to current network and save it to local state for use
        try {
          const counter = new web3.eth.Contract(
            Counter.abi,
            Counter.networks[netId].address
          );
          setCounter(counter);
        } catch (e) {
          console.log('Error', e);
          throw new Error(e);
        }
        // Throw error
      } else {
        alert('Please log in with Metamask');
      }
    };
    loadBlockchain();
  }, []);
  // Retrieve the count and set it to state
  const getCount = useCallback(async () => {
    if (counter !== 'undefined') {
      try {
        const count = await counter?.methods
          ?.getCount()
          .call({ from: account });
        setCount(count);
      } catch (e) {
        console.log('Error', e);
      }
    }
  }, [account, counter]);

  // This will update the UI on initial load.
  useEffect(() => {
    const getTheCount = async () => {
      await getCount();
      setAccountBalance();
    };
    getTheCount();
  });

  const incrementCounter = async () => {
    try {
      // Set Loading to true to prevent spamming
      setIncLoading(true);
      await counter.methods
        .increment()
        .send({ from: account })
        .on('receipt', () => {
          setIncLoading(false);
        });
      // run getCount here to update UI
      await getCount();
    } catch (e) {
      // Set it here in case the user rejects the increment
      setIncLoading(false);
      console.log('Error', e);
    }
  };

  const decrementCounter = async () => {
    try {
      // Set loading to true so user doesn't spam button
      setDecLoading(true);
      // send counter method to decrease count and wait for receipt to set loading to false
      await counter.methods
        .decrement()
        .send({ from: account })
        .on('receipt', () => {
          setDecLoading(false);
        });
      // run getCount to update UI
      await getCount();
    } catch (e) {
      // Set it here in case the user rejects the decrement
      setDecLoading(false);
      console.log('Error', e);
    }
  };

  return (
    <div className="App">
      <header>
        {/* Conditional Check to see if the user is logged into and connected with Metamask */}
        <h1>Blockchain Counter</h1>
        {account === '' ? (
          <p>Please connect with Metamask to use this app</p>
        ) : (
          <>
            <p>Your Account # is: {account}</p>
            {/* Display the Balance */}
            {balance !== null ? (
              <p>
                You have a balance of: {web3?.utils.fromWei(balance, 'ether')}{' '}
                ETH
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </>
        )}
      </header>
      {/* Display Counter */}
      {count !== undefined ? (
        <div className="interface">
          <div className="counter">
            <button
              type="button"
              disabled={incLoading}
              onClick={(e) => incrementCounter()}
            >
              +
            </button>
            <p>The count is: {count} </p>
            <button
              type="button"
              disabled={decLoading}
              onClick={(e) => decrementCounter()}
            >
              -
            </button>
          </div>
          <div className="get-count">
            <button
              type="button"
              onClick={() => alert(`The count is ${count}`)}
            >
              Get Count
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
