const { expect } = require('chai');
const Counter = artifacts.require('./Counter');

contract('Contact:', () => {
  let account, count, netId, counter;

  beforeEach(async () => {
    netId = await web3.eth.net.getId();
    [account] = await web3.eth.getAccounts();
    counter = new web3.eth.Contract(
      Counter.abi,
      Counter.networks[netId].address
    );
  });

  describe('Check if Counter exists', () => {
    it('has an address', async () => {
      expect(await counter);
    });
  });

  describe('Account Tests', () => {
    it('fetches an acount', async () => {
      expect(account.length).to.be.above(40);
    });
    it('gets the account balance', async () => {
      const balance = await web3.eth.getBalance(account);
      expect(balance).to.not.eq(undefined);
    });
  });

  describe('Counter Get Count', async () => {
    it('calls the count', async () => {
      count = Number(await counter.methods.getCount().call({ from: account }));
      expect(count).to.be.eq(0);
    });
  });
  describe('Counter Increment', () => {
    it('increments the counter', async () => {
      await counter.methods.increment().send({ from: account });
      await counter.methods.increment().send({ from: account });
      count = Number(await counter.methods.getCount().call({ from: account }));
      expect(count).to.be.eq(2);
    });
  });
  describe('Counter Decrement', () => {
    it('decrements the counter', async () => {
      await counter.methods.decrement().send({ from: account });
      count = Number(await counter.methods.getCount().call({ from: account }));
      expect(count).to.be.eq(1);
    });
  });
});
