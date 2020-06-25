import isHelpersConfigured from './helpers';
import { web3, provider } from './setup-provider';
import { accounts, privateKeys, defaultSender } from './accounts';
import contract from './setup-loader';
import { runCoverage } from './coverage';
import config from './config';

export { accounts, privateKeys, defaultSender, web3, provider, contract, isHelpersConfigured, runCoverage, config };
