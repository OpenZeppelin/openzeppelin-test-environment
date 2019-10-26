import test from 'ava';

const { web3, getAccounts, getContract, getNetworkId } = require('asado');

const FooBar = getContract('FooBar');

let deployer;
let accounts;
let args;
let fooBar;

test.before(async function() {
  [, deployer, ...accounts] = await getAccounts();
  args = { from: deployer, gas: 2e6 };

  // deploy your contract
  fooBar = await FooBar.deploy().send(args);
});

test('foo with a bar', async t => {
  t.is(await fooBar.methods.foo().call(), 'bar');
});

test('reverts a transaction', async t => {
  const error = await t.throwsAsync(fooBar.methods.reverts().send(args));
  t.regex(error.message, /Just do it!/);
});

test('fails requires', async t => {
  const error = await t.throwsAsync(fooBar.methods.requires(324).send(args));
  t.regex(error.message, /Wrong answer/);
});

test('pass require with a right answer ', async t => {
  const ret = await fooBar.methods.requires(42).send(args);
  t.not(ret, null);
});
