# OpenZeppelin Test Environment

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-env.svg)](https://www.npmjs.org/package/@openzeppelin/test-env)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env)

**Blazing fast smart contract testing.** One-line setup for a dramatically better testing experience.

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

Simply `require('@openzeppelin/test-environment')` in your test files, and it will take care of all Ethereum-related tasks. A local blockchain with unlocked accounts will be spinned up, and all tools will be configured to work with it.

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

Head to our [test runners guide](docs/test-runners) to learn more about how to setup each one.

## Compiling your contracts

`test-environment` is not a contract compiler: for that, you'll want to use the [OpenZeppelin CLI](https://docs.openzeppelin.com/sdk/2.5/).

```
npm install --save-dev @openzeppelin/cli
npx oz compile
```

Compilation artifacts will be stored in the `build/contracts` directory, where `testing-environment` (and most other tools) will read them from.

## [OpenZeppelin Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers) support

`testing-environment` does not include the Test Helpers library, but it will automatically detect it and configure it if it is installed. Simply `require('@openzeppelin/test-helpers')` and use it as you already do.

## Configuration

The default options are very sensible and should work fine for most testing setups, but you are free to modify these. Simply create a file named `test-env.config.js` at the root level of your project: its contents will be automatically loaded.

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

Truffle uses a lightly modified Mocha (bundled with Chai) as a test runner, making it the best choice for a simple migration.

```
npm install --save-dev mocha chai
```

### Importing `test-environment` and `chai`

Add the following line to the top of each of your test files:

```javascript
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
```

Truffle also automagically imports Chai, so you'll need to do that manually:

```javascript
// For expect() assertions
const { expect } = require('chai');

// For should() assertions
require('chai').should();
```

### Replacing truffle constructs

In `truffle test`, contract objects are loaded by calling `artifacts.require()`. Replace all instances for calls to `contract.fromArtifact`.

Replace the top level call to truffle's `contract` function by a regular Mocha `describe`. `contract` receives an array of accounts as an argument, which `test-environment` exports as `accounts`.

### Test command

Finally, run `npx mocha --exit --recursive test` to run your tests. Enjoy lightning fast testing!

You can add this to your `package.json` file under `scripts/test` to then run tests via `npm test`:

```json
// package.json
"scripts": {
  "test": "npx mocha --exit --recursive test"
}
```

### Example migration

Using `truffle test`:

```javascript
const ERC20 = artifacts.require('ERC20');

contract('ERC20', function (accounts) {
  ...
}
```

Using `test-environment`:

```javascript
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');

const ERC20 = contract.fromAbstraction('ERC20');

describe('ERC20', function () {
  ...
}
```

## API

```javascript
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
```

#### accounts

```typescript
accounts: string[]
```

`accounts` is an array of strings representing all the accounts avaiable for testing. Every account is funded with initial balance equal be default to 100 ETH. Default deployer account is not among them. That is by design.

#### contract

```typescript
contract.fromABI: (abi: object, bytecode?: string | undefined) => any;
contract.fromArtifact: (contract: string) => any;
```

`contract` object contains two functions `fromABI` and `fromArtifact` allowing to load contracts from an ABI or an artifact correspondendly. Returns either [web3-eth-contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) or [@truffle/contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) depending on a [configuration](#config).

```javascript
// Load from artifacts built by the compiler (stored in .json files)
const ERC20 = web3Loader.fromArtifact('ERC20');

// Or load directly from an ABI
const abi = [ ... ];
const ERC20 = load.fromABI(abi);
```

#### provider

```typescript
provider: Provider;
```

`provider` is a [web3.js](https://github.com/ethereum/web3.js/) provider wrapped around a [Ganache](https://github.com/trufflesuite/ganache-core) Ethereum test client. Can be used to create a new instances of convinience web3 libraries like [web3.js](<[web3.js](https://github.com/ethereum/web3.js/)>), [ethers.js](https://github.com/ethers-io/ethers.js/).

## License

Released under the [MIT License](LICENSE).
