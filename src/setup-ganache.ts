import path from 'path';
import { fork, ChildProcess } from 'child_process';

import { GanacheServer } from './types';

import { accountsConfig } from './accounts';
import config from './config';

export default async function(): Promise<string> {
  const server = fork(path.join(__dirname, 'ganache-server'));

  const options: GanacheServer.Options = {
    accountsConfig,
    gasLimit: config.blockGasLimit
  };
  server.send(options);

  const messageReceived: Promise<GanacheServer.Message> = new Promise(
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
