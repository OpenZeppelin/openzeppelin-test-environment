Let's take a look at how testing the following contract would look with each runner.

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
const { accounts, contract } = require('@openzeppelin/test-environment');
const [ initalHolder, other ] = accounts;

const { expect } = require('chai');

const MyToken = contract.fromArtifact('MyToken');

describe('MyToken', function() {
  beforeEach(async function() {
    this.token = await MyToken.new({ from: initialHolder });
  });

  it('initialHolder can transfer tokens', async function() {
    await this.token.transfer(other, 20, { from: initialHolder });
    expect(await this.token.balanceOf(other)).to.equal('20');
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
const { accounts, contract } = require('@openzeppelin/test-environment');
const [ initialHolder, other ] = accounts;

const MyToken = contract.fromArtifact('MyToken');
let token;

describe('MyToken', function() {
  beforeEach(async function() {
    token = await MyToken.new({ from: initialHolder });
  });

  it('initialHolder can transfer tokens', async function() {
    await this.token.transfer(other, 20, { from: initialHolder });
    expect(await this.token.balanceOf(other)).toEqual('20');
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

import { accounts, contract } from '@openzeppelin/test-environment';
const [ initialHolder, other ] = accounts;

const MyToken = contract.fromArtifact('MyToken');

test.before(async t => {
  t.context.token = await MyToken.new({ from: initialHolder });
});

test('initialHolder can transfer tokens', async t => {
  await t.context.token.transfer(other, 20, { from: initialHolder });
  t.is(await t.context.token.balanceOf(other), '20');
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
