import path from 'path';
import { fork } from 'child_process';
import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { provider } from 'web3-core';

import ChildTestProvider from './ChildTestProvider';
import ExternalTestProvider from './ExternalTestProvider';

import { generateAccounts } from './accounts';

import config from './config';

const { accounts, accountsConfig } = generateAccounts(
  config.accounts.amount + 1, // extra account for the default sender
  config.accounts.ether,
);

let provider: Provider;

if (!config.provider) {
  const server = fork(path.join(__dirname, 'ganache-server'));
  server.send({ accountsConfig, gasLimit: config.gasLimit });

  provider = new ChildTestProvider(server);

  // TODO: also kill server when exiting due to error
  process.on('beforeExit', () => {
    server.kill();
  });
} else {
  provider = new ExternalTestProvider(config.provider, accountsConfig);
}

const web3 = new Web3(provider as provider);

export { accounts, web3, provider };
