const { accounts, load } = require('@openzeppelin/test-env');
const [ deployer ] = accounts;

const FooBar = load.web3.fromArtifacts('FooBar');
let fooBar;

describe('FooBar', function() {
  beforeAll(async function() {
    fooBar = await FooBar.deploy().send();
  });

  it('foo with a bar', async function() {
    expect(await fooBar.methods.foo().call()).toEqual('bar');
  });

  it('reverts a transaction', async function() {
    try {
      const ret = await fooBar.methods.reverts().send();
    } catch (err) {
      return expect(err.message).toMatch(/Just do it/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('fails requires', async function() {
    try {
      const ret = await fooBar.methods.requires(324).send();
    } catch (err) {
      return expect(err.message).toMatch(/Wrong answer/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('pass require with a right answer ', async function() {
    const ret = await fooBar.methods.requires(42).send();
    expect(ret).not.toBeNull();
  });
});
