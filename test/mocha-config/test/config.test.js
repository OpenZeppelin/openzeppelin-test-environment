const { accounts, provider, web3 } = require('@openzeppelin/test-env');
const { expect } = require('chai');

const config = require('../.test-env.js');

const uniq = require('lodash.uniq');

describe('config', function() {
  describe('accounts', function () {
    it('the number of unlocked accounts can be configured', function () {
      expect(accounts.length).to.equal(config.accounts);
    });

    it('all accounts are different', function () {
      expect(uniq(accounts).length).to.equal(config.accounts);
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
