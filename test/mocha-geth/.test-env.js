const Web3 = require('web3');

module.exports = {
  accounts: {
    amount: 20,
    ether: 1e6,
  },
  provider: new Web3.providers.HttpProvider('http://localhost:8545'),
};
