import isHelpersConfigured from './helpers';
import { web3, provider } from './setup-provider';
import { accounts, accountsConfig, defaultSender } from './accounts';
import contract from './setup-loader';

export { accounts, accountsConfig, defaultSender, web3, provider, contract, isHelpersConfigured };
