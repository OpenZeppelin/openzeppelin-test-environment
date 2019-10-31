import test from 'ava';

const { accounts, load } = require('@openzeppelin/test-env');
const [ deployer ] = accounts;

const FooBar = load('FooBar');

let fooBar;

test.before(async function() {
  // deploy your contract
  fooBar = await FooBar.deploy().send();
});

test('foo with a bar', async t => {
  t.is(await fooBar.methods.foo().call(), 'bar');
});

test('reverts a transaction', async t => {
  const error = await t.throwsAsync(fooBar.methods.reverts().send());
  t.regex(error.message, /Just do it!/);
});

test('fails requires', async t => {
  const error = await t.throwsAsync(fooBar.methods.requires(324).send());
  t.regex(error.message, /Wrong answer/);
});

test('pass require with a right answer ', async t => {
  const ret = await fooBar.methods.requires(42).send();
  t.not(ret, null);
});
