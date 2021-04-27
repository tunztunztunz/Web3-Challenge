# Dustin Simensen - web3 challenge

Build a basic front-end that connects to the Ethereum blockchain with a
[MetaMask](https://metamask.io/) wallet, and makes function calls to a smart
contract. The app should display your ETH address and balance, along with a
button to increment, decrement, and get the count.

## User Stories

- I can connect to my MetaMask wallet and see my address and balance ✅
- I can increment the counter ✅
- I can decrement the counter ✅
- I can get the count ✅

## What I Did

I used create-react-app to bootstrap a simple React UI. I have also written some
simple tests for the smart contract using Chai.

I added two lines to the Truffle config:

```
contracts_directory: './src/contracts/',

contracts_build_directory: './src/abis/',
```

## Getting Starting

```
npm install
```

To start the development envrioment

```
npm run start
```

The tests are working in the Truffle development enviroment

```
truffle develop
```

```
truffle test
```

Thank you for taking the time to look at this repo. I'm open to any feedback you
may have for me. 👍
