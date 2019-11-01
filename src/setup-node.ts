import path from 'path';
import { fork, ChildProcess } from 'child_process';
import Web3 from 'web3';

import TestProvider from './TestProvider';
import { generateAccounts } from './accounts';

import config from './config';

const { accounts, accountsConfig } = generateAccounts(config.accounts + 1); // extra account for the default sender

const server = fork(path.join(__dirname, 'ganache-server'));
server.send({ port: config.port, accountsConfig, gasLimit: config.gasLimit });

const provider = new TestProvider(`http://localhost:${config.port}`);

const web3 = new Web3(provider);

const messageReceived = new Promise(
  (resolve): ChildProcess => {
    return server.once('message', resolve);
  },
);

provider.enqueue(async () => {
  const message = await messageReceived;

  switch (message) {
    case 'error':
      server.kill();
      break;
    case 'ready':
      server.disconnect();
      server.unref();
      break;
    default:
      throw new Error(`Uknown internal error ${message}`);
  }
});

// TODO: also kill server when exiting due to error
process.on('beforeExit', () => {
  server.kill();
});

export { accounts, web3, provider };
