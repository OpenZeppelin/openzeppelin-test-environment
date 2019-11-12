import isHelpersConfigured from './helpers';
import { web3, provider } from './setupProvider';
import { accounts, defaultSender } from './accounts';
import load from './setupLoader';

module.exports = {
  accounts,
  defaultSender,
  web3,
  provider,
  load,
  isHelpersConfigured,
};
