import path from 'path';
import { fork, ChildProcess } from 'child_process';

import { accountsConfig } from './accounts';
import config from './config';

interface ErrorMessage {
  type: 'error';
}

interface ReadyMessage {
  type: 'ready';
  port: number;
}

export type Message = ErrorMessage | ReadyMessage;

export type AccountConfig = {
  balance: string;
  secretKey: string;
};

export type Options = {
  accountsConfig: AccountConfig[];
  gasLimit: number;
  coverage: boolean;
};

export default async function(): Promise<string> {
  const server = fork(path.join(__dirname, 'ganache-server'));

  const options: Options = {
    accountsConfig,
    gasLimit: config.blockGasLimit,
    coverage: process.env.OZ_TEST_ENV_COVERAGE !== undefined,
  };
  server.send(options);

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
