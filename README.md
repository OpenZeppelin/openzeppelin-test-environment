# OpenZeppelin Test Environment

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-env.svg)](https://www.npmjs.org/package/@openzeppelin/test-env)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env)

**Blazing fast smart contract testing.** One-line setup for an awesome testing experience.

- Near-instant start up: have your code running in under 2s after typing `npm test`.
- Test runner agnostic – from the familiarity of Mocha, to _parallel tests_ using Jest or Ava!
- Non-opinionated: use either [`@truffle/contract`](https://www.npmjs.com/package/@truffle/contract) or [`web3-eth-contract`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) as you see fit.
- First class support for the [OpenZeppelin Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers).
- Highly configurable: from gas limit and initial balance, to complex custom web3 providers.
- No global variables, no hacks.

_`test-environment` is the result of our learnings while developing the [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts), combining best practices and the tools we've come to rely on over the years. We think you'll love it!_

## Quickstart

### Install

```bash
npm install --save-dev @openzeppelin/test-environment
```

### Usage

Simply `require('@openzeppelin/test-environment')` in your test files, and it will take care of all Ethereum-related tasks. A local [ganache-powered blockchain](https://github.com/trufflesuite/ganache-core) with unlocked accounts will be spinned up, and all tools will be configured to work with it.

```javascript
const { accounts, contract } = require('@openzeppelin/test-environment');
const [ tokenHolder ] = accounts;

const ERC20 = contract.fromArtifact('ERC20'); // Loads a compiled contract

async function test() {
  const token = await ERC20.new({ from: tokenHolder });
  const initialBalance = await token.balanceOf(tokenHolder);
}
```

_Note: if you'd rather not rely on truffle contracts and use web3 contract types directly, worry not: you can [configure `test-environment`](#configuration) to use the `web3-eth-contract` abstraction._

## Test runners

`test-environment` is a testing _library_, something you use _in_ your tests, as opposed to what actually _runs_ them. For that, you are free to use any regular JavaScript test runner. We recommend picking one of the following:
 * [Mocha](https://mochajs.org/): simple and straightforward, the easiest way to get started when migrating from `truffle test`
 * [Jest](https://jestjs.io/): the most popular runner out there, featuring lightning speed, parallel tests, and extensive guides
 * [Ava](https://www.npmjs.com/package/ava/): a minimalistic runner with parallel tests and support for ES6 and TypeScript

Both Jest and Ava have their own assertions library, but for Mocha, you may want to also use [Chai](https://www.chaijs.com).

Head to our [test runners guide](docs/test-runners.md) to learn more about how to setup each one.

## Compiling your contracts

`test-environment` is not a contract compiler: for that, you'll want to use the [OpenZeppelin CLI](https://docs.openzeppelin.com/sdk/2.5/).

```bash
npm install --save-dev @openzeppelin/cli
npx oz compile
```

Compilation artifacts will be stored in the `build/contracts` directory, where `testing-environment` (and most other tools) will read them from.

## OpenZeppelin [Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers) support

`testing-environment` does not include the Test Helpers library, but it will automatically detect it and configure it if it is installed. Simply `require('@openzeppelin/test-helpers')` and use it as you already do.

## Configuration

The default options are very sensible and should work fine for most testing setups, but you are free to modify these. Simply create a file named `test-environment.config.js` at the root level of your project: its contents will be automatically loaded.

```javascript
module.exports = {
  accounts: {
    amount: 10, // Number of unlocked accounts
    ether: 100, // Initial balance of unlocked accounts (in ether)
  },

  contracts: {
    type: 'truffle', // Contract abstraction to use: 'truffle' for @truffle/contract or 'web3' for web3-eth-contract
    defaultGas: 6e6, // Maximum gas for contract calls (when unspecified)
  },

  blockGasLimit: 8e6, // Maximum gas per block
};
```

## Migrating from `truffle test`

Despite Truffle's design and goals being different from `test-environment`'s (one is an all-out development framework and the other a testing library), it is still quite simple to migrate from a `truffle test`-based suite. Doing the whole process on the OpenZeppelin Contracts repository took less than thirty minutes!

Because `truffle test` uses a lightly modified Mocha as a test runner (bundled with Chai for assertions), these two make best choice for a simple migration:

```bash
npm install --save-dev mocha chai
```

Don't forget to make Mocha the entry point of your test suite once you install it:

```diff
// in package.json
"scripts": {
-  "test": "npx truffle test"
+  "test": "npx mocha --exit --recursive test"
}
```

It is now time to modify the test files themselves. The changes are few, but important:
 1. Add `require('@openzeppelin/test-environment')` to access the variables exported by the library: `accounts`, `contract`, `web3`, etc.
 1. `truffle test` automagically imports Chai: you will need to `require` it and set it up manually
 1. Replace all instances of `artifacts.require` for `contract.fromArtifact`
 1. Replace all intances of `truffle test`'s `contract` function with a regular Mocha `describe`. You can still access the accounts array in `accounts`

That's it! Let's see how a full migration might look like:

```diff
+const { accounts, contract, web3 } = require('@openzeppelin/test-environment');

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
+const { expect } = require('chai');
+require('chai').should();

-const ERC20 = artifacts.require('ERC20');
+const ERC20 = contract.fromAbstraction('ERC20');

-contract('ERC20', function (accounts) {
+describe('ERC20', function () {
  ...
}
```

You are now ready to start using `test-environment` by running `npm test`. Enjoy lightning fast testing!

## API

`test-environment` exposes a number of variables that are used to interact with the local testing blockchain it setups. These are described in detail here:

```javascript
const { accounts, defaultSender, contract, web3, provider, isHelpersConfigured } = require('@openzeppelin/test-environment');
```

### accounts

```typescript
accounts: string[]
```

An array of strings with the addresses of the accounts available for testing. By default, there are 10 unlocked accounts with 100 ETH each, but this can be [configured](#configuration).

```javascript
const [ sender, receiver ] = accounts;

await myToken.transfer(receiver, 100, { from: sender });
```

### defaultSender

```typescript
defaultSender: string
```

A special account that is used by contracts created via `contract` when no account is specified for a transaction (i.e. there is no explicit `from`). This account is _not_ included in `accounts` to prevent accidental bugs during testing: whenever you want an account to make an action (deploy a contract, transfer ownership, etc.) you should be explicit about the sender of the transaction:

```javascript
const [ owner ] = accounts;

// The depoloyment will be made by 'defaultSender' (not 'owner'!), making it
// the contract's owner
const myContract = await Ownable.new();

// And the following test will fail
expect(await myContract.owner()).to.equal(owner);
```

### contract

```typescript
contract.fromArtifact: (contract: string) => any;
contract.fromABI: (abi: object, bytecode?: string | undefined) => any;
```

The `contract` object is in charge of creating contracts from compilation artifacts. It does this via two functions:
 * `fromArtifact` looks for a `.json` file in the `build/contracts` directory (equivalent to Truffle's `artifact.require`)
 * `fromABI` receives an ABI object directly, useful when the full compilation artifacts are not available

 They both return instances of either [@truffle/contract](https://www.npmjs.com/package/@truffle/contract) (by default) or [web3-eth-contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html), depending on [configuration](#configurations).

```javascript
const ERC20 = contract.fromArtifact('ERC20');

const myToken = await ERC20.new(initialBalance, initialHolder);
```

### web3

A [`web3`](https://www.npmjs.com/package/web3) instance, connected to the local testing blockchain. Useful to access utiltiies like `web3.eth.sign`, `web3.eth.getTransaction`, or `web3.utils.sha3`.

### provider

A [`web3`](https://github.com/ethereum/web3.js/) provider, connected to the local testing blockchain. Used in more advanced scenarios, such as creation of custom `web3` or [`ethers`](https://www.npmjs.com/package/ethers) instances.

### isHelpersConfigured

```typescript
isHelpersConfigured: boolean
```

A boolean indicating if the OpenZeppelin [Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers) library was autodetected and configured.

## License

Released under the [MIT License](LICENSE).
