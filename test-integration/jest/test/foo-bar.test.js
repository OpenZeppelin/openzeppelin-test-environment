const { accounts, contract } = require('@openzeppelin/test-environment');
const [ deployer ] = accounts;

const FooBar = contract.fromArtifact('FooBar');
let fooBar;

describe('FooBar', function() {
  beforeEach(async function() {
    fooBar = await FooBar.new();
  });

  it('foo with a bar', async function() {
    expect(await fooBar.foo()).toEqual('bar');
  });

  it('reverts a transaction', async function() {
    try {
      const ret = await fooBar.reverts();
    } catch (err) {
      return expect(err.message).toMatch(/Just do it/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('fails requires', async function() {
    try {
      const ret = await fooBar.requires(324);
    } catch (err) {
      return expect(err.message).toMatch(/Wrong answer/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('pass require with a right answer ', async function() {
    const ret = await fooBar.requires(42);
    expect(ret).not.toBeNull();
  });
});
