import path from 'path';
import { fork, ChildProcess } from 'child_process';
import Web3 from 'web3';

import TestProvider from './TestProvider';
import { generateAccounts } from './accounts';

const port = '8548';
const { accounts, accountsConfig } = generateAccounts(10);

const server = fork(path.join(__dirname, 'server'));
server.send({ port, accountsConfig });

const provider = new TestProvider(`http://localhost:${port}`);

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
