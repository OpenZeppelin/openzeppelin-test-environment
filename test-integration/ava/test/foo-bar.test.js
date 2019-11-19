import test from 'ava';

const { accounts, contract } = require('@openzeppelin/test-env');
const [ deployer ] = accounts;

const FooBar = contract.fromArtifact('FooBar');

test.before(async t => {
  t.context.fooBar = await FooBar.new();
});

test('foo with a bar', async t => {
  t.is(await t.context.fooBar.foo(), 'bar');
});

test('reverts a transaction', async t => {
  const error = await t.throwsAsync(t.context.fooBar.reverts());
  t.regex(error.message, /Just do it!/);
});

test('fails requires', async t => {
  const error = await t.throwsAsync(t.context.fooBar.requires(324));
  t.regex(error.message, /Wrong answer/);
});

test('pass require with a right answer ', async t => {
  const ret = await t.context.fooBar.requires(42);
  t.not(ret, null);
});
