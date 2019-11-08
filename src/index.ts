import { setupLoader } from '@openzeppelin/contract-loader';

import config from './config';
import isHelpersConfigured from './helpers';
import { web3, provider } from './setup-node';
import { accounts, defaultSender } from './accounts';

const load = setupLoader({
  defaultSender,
  defaultGas: config.gasLimit,
  provider,
});

module.exports = {
  accounts,
  defaultSender,
  web3,
  provider,
  load,
  isHelpersConfigured,
};
