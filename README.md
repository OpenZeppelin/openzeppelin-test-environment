# OpenZeppelin Test Environment

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-env.svg)](https://www.npmjs.org/package/@openzeppelin/test-env)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-env)

One line test environment for Ethereum smart contracts tests.

- Blazing fast.
- Sync access to `accounts`, loading contracts, and web3 provider.
- Test framework agnostic – use Mocha, Jest, Ava or anything you want.
- Supports web3.js and Truffle contract abstractions.
- You can run your test over customer web3 providers like GSN.
- First class support of [OpenZeppelin Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers).
- Highly configurable using `test-env.config.js`

## Quickstart

### Install

```bash
npm i @openzeppelin/test-env
```

### Test

#### FooBar.sol

```solidity
pragma solidity ^0.5.0;

contract FooBar {

  function foo() public pure returns (string memory) {
    return "bar";
  }

  function reverts() public pure returns (uint) {
    revert("Just do it!");
  }

  function requires(uint answer) public pure returns (uint) {
    require(answer == 42, "Wrong answer");
  }

}
```

#### Test with Mocha

```javascript
const { accounts, load } = require('@openzeppelin/test-env');
const [deployer] = accounts;

const { expect } = require('chai');

const FooBar = load.fromArtifacts('FooBar');

describe('FooBar', function() {
  beforeEach(async function() {
    this.fooBar = await FooBar.deploy().send();
  });

  it('foo with a bar', async function() {
    expect(await this.fooBar.methods.foo().call()).to.be.equal('bar');
  });

  it('reverts a transaction', async function() {
    try {
      const ret = await this.fooBar.methods.reverts().send();
    } catch (err) {
      return expect(err.message).to.match(/Just do it!/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('fails requires', async function() {
    try {
      const ret = await this.fooBar.methods.requires(324).send();
    } catch (err) {
      return expect(err.message).to.match(/Wrong answer/);
    }
    expect.fail('Expected an exception but none was received');
  });

  it('pass require with a right answer ', async function() {
    const ret = await this.fooBar.methods.requires(42).send();
    expect(ret).to.not.be.null;
  });
});
```

#### Test with Jest

```javascript
const { accounts, load } = require('@openzeppelin/test-env');
const [deployer] = accounts;

const FooBar = load.fromArtifacts('FooBar');
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
```

#### Test with Ava

```javascript
import test from 'ava';

const { accounts, load } = require('@openzeppelin/test-env');
const [deployer] = accounts;

const FooBar = load.fromArtifacts('FooBar');

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
```

#### Test with OpenZeppelin Test Helpers

```javascript
```

### Config

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

Released under the MIT License.
