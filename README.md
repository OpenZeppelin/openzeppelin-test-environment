# OpenZeppelin Test Environment

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-environment.svg)](https://www.npmjs.org/package/@openzeppelin/test-environment)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-environment.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-environment)

**Blazing fast smart contract testing.** One-line setup for an awesome testing experience.

- Near-instant start up: have your code running in under 2s after typing `npm test`.
- Test runner agnostic – from the familiarity of Mocha, to [_parallel tests_](docs/modules/ROOT/pages/choosing-a-test-runner.adoc#parallel-tests) using Jest or Ava!
- Non-opinionated: use either [`@truffle/contract`](https://www.npmjs.com/package/@truffle/contract) or [`web3-eth-contract`](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html) as you see fit.
- First class support for the [OpenZeppelin Test Helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers).
- Highly configurable: from gas limit and initial balance, to complex custom web3 providers.
- No global variables, no hacks.

_`test-environment` is the result of our learnings while developing the [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts), combining best practices and the tools we've come to rely on over the years. We think you'll love it!_

## Overview

### Installation

```bash
npm install --save-dev @openzeppelin/test-environment
```

### Usage

By including `require('@openzeppelin/test-environment')` in your test files, a local [ganache-powered blockchain](https://github.com/trufflesuite/ganache-core) with unlocked accounts will be spun up, and all tools configured to work with it.

Here's a quick sample of how using `test-environment` in a [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) setup looks like.

```javascript
const { accounts, contract } = require('@openzeppelin/test-environment');
const [ owner ] = accounts;

const { expect } = require('chai');

const MyContract = contract.fromArtifact('MyContract'); // Loads a compiled contract

describe('MyContract', function () {
  it('deployer is owner', async function () {
    const myContract = await MyContract.new({ from: owner });
    expect(await myContract.owner()).to.equal(owner);
  });
});
```

If you're used to `truffle test`, this probably looks very familiar. Follow our guide on [migrating from Truffle](docs/modules/ROOT/pages/migrating-from-truffle.adoc) to have your project running with `test-environment` in a breeze!

_Note: if you'd rather not rely on truffle contracts and use web3 contract types directly, worry not: you can [configure `test-environment`](docs/modules/ROOT/pages/getting-started.adoc#configuration) to use the `web3-eth-contract` abstraction._

## Learn More

 * Check out [Getting Started](docs/modules/ROOT/prages/getting-started.adoc) to use Test Environment in a new project.
 * If you are currently using `truffle test`, head instead to [Migrating from Truffle](docs/modules/ROOT/prages/migrating-from-truffle.adoc).
 * The [Choosing a Test Runner](docs/modules/ROOT/prages/choosing-a-test-runner.adoc) guide will teach you how to use each of the different runners.
 * For detailed usage information, take a look at the [API Reference](docs/modules/ROOT/prages/api.adoc).

## License

Released under the [MIT License](LICENSE).
