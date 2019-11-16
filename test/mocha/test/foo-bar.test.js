const { accounts, contract } = require('@openzeppelin/test-env');
const [ deployer ] = accounts;

const { expect } = require('chai');

const FooBar = contract.fromArtifact('FooBar');

describe('FooBar', function() {
  beforeEach(async function() {
    this.fooBar = await FooBar.deploy().send();
  });

  it('foo with a bar', async function() {
    expect(await this.fooBar.methods.foo().call()).to.be.equal('bar');
  });

  it('reverts a transaction', async function() {
    try {
      const ret = await this.fooBar.methods.reverts().send();
    } catch (err) {
      return expect(err.message).to.match(/Just do it!/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('fails requires', async function() {
    try {
      const ret = await this.fooBar.methods.requires(324).send();
    } catch (err) {
      return expect(err.message).to.match(/Wrong answer/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('pass require with a right answer ', async function() {
    const ret = await this.fooBar.methods.requires(42).send();
    expect(ret).to.not.be.null;
  });
});
