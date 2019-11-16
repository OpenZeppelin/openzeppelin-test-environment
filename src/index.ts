import isHelpersConfigured from './helpers';
import { web3, provider } from './setup-provider';
import { accounts, defaultSender } from './accounts';
import contract from './setup-loader';

module.exports = {
  accounts,
  defaultSender,
  web3,
  provider,
  contract,
  isHelpersConfigured,
};
