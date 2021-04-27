const fs = require('fs');
const path = require('path');
// eslint-disable-next-line no-undef
const Counter = artifacts.require("Counter");

module.exports = function (deployer) {
  deployer
    .deploy(Counter)
    .then(async () => {
      const counterAddress = JSON.stringify({ address: Counter.address });
      // eslint-disable-next-line no-undef
      const testNetName = await web3.eth.net.getNetworkType();
      fs.writeFile(path.resolve(__dirname, '..', 'build', `${testNetName}_CounterAddress.json`), counterAddress, err => {
        if (err) {
          console.error(err)
          return
        }
      });
    });
};