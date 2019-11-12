import path from 'path';
import { fork, ChildProcess } from 'child_process';

import { Message } from './types';

import { accountsConfig } from './accounts';
import config from './config';

interface Pipe {
  unref(): unknown;
}

export default async function(): Promise<string> {
  const server = fork(path.join(__dirname, 'ganacheServer'));
  server.send({ accountsConfig, gasLimit: config.blockGasLimit });

  const messageReceived: Promise<Message> = new Promise(
    (resolve): ChildProcess => {
      return server.once('message', resolve);
    },
  );

  const message = await messageReceived;

  if (message.type === 'ready') {
    (server.channel as Pipe).unref(); // The type of server.channel is missing unref
    server.unref();

    return `http://localhost:${message.port}`;
  } else if (message.type === 'error') {
    server.kill();
    throw new Error('Unhandled server error');
  } else {
    throw new Error(`Uknown server message: '${message}'`);
  }
}
