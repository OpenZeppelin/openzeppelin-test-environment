import * as loader from '@openzeppelin/contract-loader';

import config from './config';
import isHelpersConfigured from './helpers';
import { accounts, web3, provider } from './web3';

// We use the first account as the default sender (when no sender is specified),
// which provides versatility for tests where this sender is not important
// (e.g. when calling view functions).
// We also don't expose this account so that it is not possible to explicitly
// use it, creating a scenario where the default account and an explicit account
// are the same one, which can create hard to debug failing tests.

const defaultSender = accounts[0];
const exposedAccounts = accounts.slice(1);

const loaderConfig = {
  defaultSender,
  defaultGas: config.gasLimit,
};

const load = {
  web3: loader.web3({
    ...loaderConfig,
    web3Contract: web3.eth.Contract,
  }),

  truffle: loader.truffle({
    ...loaderConfig,
    truffleContract: web3.eth.Contract,
    provider,
  }),
};

module.exports = {
  accounts: exposedAccounts,
  web3,
  provider,
  load,
  isHelpersConfigured,
};
