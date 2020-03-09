import isHelpersConfigured from './helpers';
import { web3, provider } from './setup-provider';
import { accounts, defaultSender } from './accounts';
import contract from './setup-loader';

export { accounts, defaultSender, web3, provider, contract, isHelpersConfigured };
