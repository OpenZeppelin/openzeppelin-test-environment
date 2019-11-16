# OpenZeppelin Test Environment

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-env.svg)](https://www.npmjs.org/package/@openzeppelin/test-env)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env)

**Blazing fast smart contract testing.** One-line setup for a dramatically better testing experience.

- Near-instant start up: have your code running in under 2s after typing `npm test`.
- Test runner agnostic – from the familiarity of Mocha, to _parallel tests_ using Jest or Ava!
- Non-opinionated: use either [`web3-eth-contract`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) or [`@truffle/contract`](https://www.npmjs.com/package/@truffle/contract) as you see fit.
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
  const token = await ERC20.deploy().send({ from: tokenHolder });
  const initialBalance = await token.balanceOf(tokenHolder);
}
```

_Note: if you're used to `truffle test` and are not familiar with the `.send()` syntax, worry not: you can [configure `test-environment`](#configuration) to use the truffle contract abstraction._

## [OpenZeppelin Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers) support

`testing-environment` does not include the Test Helpers library, but it will automatically detect it and configure it if it is installed. Simply `require('@openzeppelin/test-helpers')` and use it as you are already used to.

## Test runners

`test-environment` is a testing _library_, something you use _in_ your tests, as opposed to what actually _runs_ them. For that, you are free to use any regular JavaScript test runner. We recommend picking one of the following:
 * [Mocha](https://mochajs.org/): simple and straightforward, the easiest way to get started when migrating from `truffle test`
 * [Jest](https://jestjs.io/): the most popular runner out there, featuring lightning speed, parallel tests, and extensive guides
 * [Ava](https://www.npmjs.com/package/ava/): a minimalistic runner with parallel tests and support for ES6 and TypeScript

Both Jest and Ava have their own assertions library, but for Mocha, you'll also want to use [Chai](https://www.chaijs.com).

Let's take a look a how testing the following contract would look with each runner.

```solidity
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
  constructor() public {
    _mint(msg.sender, 1000);
  }
}
```

### Using Mocha

```javascript
const { accounts, contract } = require('@openzeppelin/test-env');
const [ initalHolder, other ] = accounts;

const { expect } = require('chai');

const MyToken = contract.fromArtifacts('MyToken');

describe('MyToken', function() {
  beforeEach(async function() {
    this.token = await MyToken.deploy().send({ from: initialHolder });
  });

  it('initialHolder can transfer tokens', async function() {
    await this.token.methods.transfer(other, 20).send({ from: initialHolder });
    expect(await this.token.balanceOf(other).call()).to.equal('20');
  });
});
```

Install Mocha and Chai via:

```
npm install --save-dev mocha chai
```

And run all tests in the `test` directory with:

```
npx mocha --recursive test --exit
```

_Note: the `--exit` flag is required in Mocha when using the truffle contract abstraction: otherwise, Mocha will hang after all tests finish running._

### About parallel tests

Both Jest and Ava will let you run tests in parallel: each test file will be executed at the same time, leading to massive time savings when running a large test suite. `test-environment` is smart enough to create a separate local blockchain for each parallel run, so there is zero risk of your tests interacting with each other and causing issues.

Migrating from Mocha to Jest is rather straightforward, and is well worth the effort if you are spending too much time waiting for tests to finish.

### Using Jest

Jest looks very similar to Mocha (`describe`, `it` and `beforeEach` are all there), but there are two big differences:
 * You don't need to use Chai, since Jest has its own assertion library (read the docs [here!](https://jestjs.io/docs/en/using-matchers))
 * You cannot store objects in `this` inside `beforeEach`

```javascript
const { accounts, contract } = require('@openzeppelin/test-env');
const [ initialHolder, other ] = accounts;

const MyToken = contract.fromArtifacts('MyToken');
let token;

describe('MyToken', function() {
  beforeEach(async function() {
    token = await MyToken.deploy().send({ from: initialHolder });
  });

  it('initialHolder can transfer tokens', async function() {
    await this.token.methods.transfer(other, 20).send({ from: initialHolder });
    expect(await this.token.balanceOf(other).call()).toEqual('20');
  });
});
```

_If migrating from Mocha, you can still use Chai to reduce the number of changes you need to make to your tests. Just be careful not to get Chai's and Jest's `expect` mixed up!._

Install Jest via:

```
npm install --save-dev jest
```

Jest will run all `*.test.js` files with:

```
npx jest ./test
```

It also features [extensive command line options](https://jestjs.io/docs/en/cli) for you to quickly run a reduced set of tests, which comes very handy during development.

### Using Ava

Ava is a new, modern test runner, product of learnings on the JavaScript ecosystem over the years. As such, it may look different from what you're used to, but it is a great tool that is worth learning how to use. [Their documentation](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md) is a great starting point.

```javascript
import test from 'ava';

import { accounts, contract } from '@openzeppelin/test-env';
const [ initialHolder, other ] = accounts;

const MyToken = contract.fromArtifacts('MyToken');

test.before(async t => {
  t.context.token = await FooBar.deploy().send({ from: initialHolder });
});

test('initialHolder can transfer tokens', async t => {
  await t.context.token.methods.transfer(other, 20).send({ from: initialHolder });
  t.is(await t.context.token.balanceOf(other).call(), '20');
});
```

Install Ava via:

```
npm install --save-dev ava
```

Ava will run all files in the `test` directory with:

```
npx ava
```
### Compiling your contracts

`test-environment` is not a contract compiler: for that, you'll want to use the [OpenZeppelin CLI](https://docs.openzeppelin.com/sdk/2.5/).

```
npm install --save-dev @openzeppelin/cli
npx oz compile
```

Compilation artifacts will be stored in the `build/contracts` directory.

### Configuration

`test-env.config.js`

### Migrate from Truffle Test

## API

```javascript
const { accounts, load, provider, defaultSender, web3 } = require('@openzeppelin/test-env');
```

#### accounts

```typescript
accounts: string[]
```

`accounts` is an array of strings representing all the accounts avaiable for testing. Every account is funded with initial balance equal be default to 100 ETH. Default deployer account is not among them. That is by design.

#### load

```typescript
load.fromABI: (abi: object, bytecode?: string | undefined) => any;
load.fromArtifact: (contract: string) => any;
```

`load` object contains two functions `fromABI` and `fromArtifacts` allowing to load contracts from an ABI or an artifact correspondendly. Returns either [web3-eth-contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) or [@truffle/contract](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) depending on a [configuration](#config).

```javascript
// Load from artifacts built by the compiler (stored in .json files)
const ERC20 = web3Loader.fromArtifact('ERC20');

// Or load directly from an ABI
const abi = [ ... ];
const ERC20 = load.fromABI(abi);
```

Learn more about [OpenZeppelin Contract Loader](https://github.com/OpenZeppelin/openzeppelin-contract-loader).

#### provider

```typescript
provider: Provider;
```

`provider` is a [web3.js](https://github.com/ethereum/web3.js/) provider wrapped around a [Ganache](https://github.com/trufflesuite/ganache-core) Ethereum test client. Can be used to create a new instances of convinience web3 libraries like [web3.js](<[web3.js](https://github.com/ethereum/web3.js/)>), [ethers.js](https://github.com/ethers-io/ethers.js/).

## License

Released under the [MIT License](LICENSE).
