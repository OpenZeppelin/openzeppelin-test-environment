const { web3, getAccounts, getContract, getNetworkId } = require('asado');

const FooBar = getContract('FooBar');

let deployer;
let accounts;
let args;
let fooBar;

describe('FooBar', function() {
  beforeAll(async function() {
    [, deployer, ...accounts] = await getAccounts();
    args = { from: deployer, gas: 2e6 };

    // deploy your contract
    fooBar = await FooBar.deploy().send(args);
  });

  it('foo with a bar', async function() {
    expect(await fooBar.methods.foo().call()).toEqual('bar');
  });

  it('reverts a transaction', async function() {
    try {
      const ret = await fooBar.methods.reverts().send(args);
    } catch (err) {
      return expect(err.message).toMatch(/Just do it/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('fails requires', async function() {
    try {
      const ret = await fooBar.methods.requires(324).send(args);
    } catch (err) {
      return expect(err.message).toMatch(/Wrong answer/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('pass require with a right answer ', async function() {
    const ret = await fooBar.methods.requires(42).send(args);
    expect(ret).not.toBeNull();
  });
});
