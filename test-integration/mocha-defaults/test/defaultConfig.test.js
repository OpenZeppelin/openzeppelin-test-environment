const { accounts, provider, web3, defaultSender } = require('@openzeppelin/test-environment');
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

    it('accounts initial balance is 100 ether', async function () {
      // We check the balance of the last account, in the hope that it hasn't been used yet and therefore has the full
      // unspent initial balance
      expect(await web3.eth.getBalance(accounts[accounts.length - 1])).to.equal((100 * 1e18).toString());
    });

    it('the default sender is not on the accounts array', async function () {
      expect(accounts).to.not.include(defaultSender);
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
