const { accounts, provider, web3 } = require('@openzeppelin/test-env');
const { expect } = require('chai');
const BN = require('bn.js');

const config = require('../.test-env.js');

const uniq = require('lodash.uniq');

describe('config', function() {
  describe('accounts', function () {
    it('the number of unlocked accounts can be configured', function () {
      expect(accounts.length).to.equal(config.accounts.amount);
    });

    it('all accounts are different', function () {
      expect(uniq(accounts).length).to.equal(config.accounts.amount);
    });

    it('accounts initial can be configured', async function () {
      // We check the balance of the last account, in the hope that it hasn't been used yet and therefore has the full
      // unspent initial balance
      expect(await web3.eth.getBalance(accounts[accounts.length - 1])).to.equal(
        new BN(config.accounts.ether).mul(new BN(1e18.toString())).toString()
      );
    });
  });

  describe('provider', function () {
    it('the port can be configured', function () {
      expect(provider.host).to.include(`:${config.port}`);
    });
  });

  describe('blockchain', function () {
    it('the gasLimit can be configured', async function () {
      await web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], gas: config.gasLimit });

      try {
        await web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], gas: config.gasLimit + 1 });
        expect.fail('Transaction over gas limit was executed');
      } catch { };
    });
  });
});
