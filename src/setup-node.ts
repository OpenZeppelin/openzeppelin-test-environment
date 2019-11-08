import path from 'path';
import { fork, ChildProcess } from 'child_process';
import Web3 from 'web3';

import TestProvider from './TestProvider';
import { accountsConfig } from './accounts';

import { Message } from './types';

import config from './config';

const server = fork(path.join(__dirname, 'ganache-server'));
server.send({ accountsConfig, gasLimit: config.gasLimit });

const provider = new TestProvider();

const web3 = new Web3(provider);

const messageReceived: Promise<Message> = new Promise(
  (resolve): ChildProcess => {
    return server.once('message', resolve);
  },
);

provider.enqueue(async () => {
  const message = await messageReceived;

  switch (message.type) {
    case 'error':
      server.kill();
      break;
    case 'ready':
      (server.channel as Pipe).unref(); // The type of server.channel is missing unref
      server.unref();
      provider._port = message.port;
      break;
    default:
      throw new Error(`Uknown internal error ${message}`);
  }
});

// TODO: also kill server when exiting due to error
process.on('beforeExit', () => {
  server.kill();
});

export { web3, provider };

interface Pipe {
  unref(): unknown;
}
