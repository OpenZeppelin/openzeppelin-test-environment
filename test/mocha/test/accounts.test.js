const { accounts } = require('@openzeppelin/test-env');
const { expect } = require('chai');

describe('accounts', function() {
  it('there are ten accounts', async function() {
    expect(accounts.length).to.equal(10);
  });
});
