import path from 'path';
import { fork, ChildProcess } from 'child_process';

import { Message } from './types';

import { accountsConfig } from './accounts';
import config from './config';

export default async function(): Promise<string> {
  const server = fork(path.join(__dirname, 'ganache-server'));
  server.send({ accountsConfig, gasLimit: config.blockGasLimit });

  const messageReceived: Promise<Message> = new Promise(
    (resolve): ChildProcess => {
      return server.once('message', resolve);
    },
  );

  const message = await messageReceived;

  switch (message.type) {
    case 'ready':
      if (server.channel) {
        server.channel.unref();
      }
      server.unref();
      return `http://localhost:${message.port}`;
    case 'error':
      server.kill();
      throw new Error('Unhandled server error');
    default:
      throw new Error(`Uknown server message: '${message}'`);
  }
}
