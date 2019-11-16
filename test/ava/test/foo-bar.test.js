import test from 'ava';

const { accounts, contract } = require('@openzeppelin/test-env');
const [ deployer ] = accounts;

const FooBar = contract.fromArtifact('FooBar');

test.before(async t => {
  t.context.fooBar = await FooBar.deploy().send();
});

test('foo with a bar', async t => {
  t.is(await t.context.fooBar.methods.foo().call(), 'bar');
});

test('reverts a transaction', async t => {
  const error = await t.throwsAsync(t.context.fooBar.methods.reverts().send());
  t.regex(error.message, /Just do it!/);
});

test('fails requires', async t => {
  const error = await t.throwsAsync(t.context.fooBar.methods.requires(324).send());
  t.regex(error.message, /Wrong answer/);
});

test('pass require with a right answer ', async t => {
  const ret = await t.context.fooBar.methods.requires(42).send();
  t.not(ret, null);
});
