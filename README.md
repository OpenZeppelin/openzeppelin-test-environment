# OpenZeppelin Test Environment

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-environment.svg)](https://www.npmjs.org/package/@openzeppelin/test-environment)
[![Build Status](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-environment.svg?style=shield)](https://circleci.com/gh/OpenZeppelin/openzeppelin-test-environment)

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

Simply `require('@openzeppelin/test-environment')` in your test files, and it will take care of all Ethereum-related tasks. A local [ganache-powered blockchain](https://github.com/trufflesuite/ganache-core) with unlocked accounts will be spun up, and all tools will be configured to work with it.

```javascript
const { accounts, contract } = require('@openzeppelin/test-environment');
const [ tokenHolder ] = accounts;

const ERC20 = contract.fromArtifact('ERC20'); // Loads a compiled contract

async function test() {
  const token = await ERC20.new({ from: tokenHolder });
  const initialBalance = await token.balanceOf(tokenHolder);
}
```

_Note: if you'd rather not rely on truffle contracts and use web3 contract types directly, worry not: you can [configure `test-environment`](https://github.com/OpenZeppelin/openzeppelin-test-environment/blob/master/docs/modules/ROOT/pages/setup.adoc#configuration) to use the `web3-eth-contract` abstraction._

## Documentation

- [Setting up Your Project](docs/modules/ROOT/pages/setup.adoc)
- [Migrate from Truffle](docs/modules/ROOT/pages/migrate-from-truffle.adoc)
- [Test Runners](docs/modules/ROOT/pages/test-runners.adoc)
- [API Reference](docs/modules/ROOT/pages/api.adoc)

## License

Released under the [MIT License](LICENSE).
