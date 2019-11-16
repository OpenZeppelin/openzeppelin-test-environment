const { accounts, contract } = require('@openzeppelin/test-env');
const [ deployer ] = accounts;

const { expect } = require('chai');

const FooBar = contract.fromArtifact('FooBar');

describe('FooBar', function() {
  beforeEach(async function() {
    this.fooBar = await FooBar.new();
  });

  it('foo with a bar', async function() {
    expect(await this.fooBar.foo()).to.be.equal('bar');
  });

  it('reverts a transaction', async function() {
    try {
      const ret = await this.fooBar.reverts();
    } catch (err) {
      return expect(err.message).to.match(/Just do it!/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('fails requires', async function() {
    try {
      const ret = await this.fooBar.requires(324);
    } catch (err) {
      return expect(err.message).to.match(/Wrong answer/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('pass require with a right answer ', async function() {
    const ret = await this.fooBar.requires(42);
    expect(ret).to.not.be.null;
  });
});
