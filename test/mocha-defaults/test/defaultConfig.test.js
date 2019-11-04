const { accounts, provider, web3 } = require('@openzeppelin/test-env');
const { expect } = require('chai');

const uniq = require('lodash.uniq');

describe('default config', function() {
  describe('accounts', function () {
    it('there are ten unlocked accounts', function () {
      expect(accounts.length).to.equal(10);
    });

    it('all accounts are different', function () {
      expect(uniq(accounts).length).to.equal(10);
    });
  });

  describe('blockchain', function () {
    it('gasLimit is 8 000 000', async function () {
      await web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], gas: 8000000 });

      try {
        await web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], gas: 8000001 });
        expect.fail('Transaction over gas limit was executed');
      } catch { };
    });
  });
});
