import path from 'path';
import { fork, ChildProcess } from 'child_process';

import { accountsConfig } from './accounts';
import config, { Config } from './config';

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

export type NodeOptions = {
  accounts: AccountConfig[];
  coverage: boolean;
  gasPrice?: string;
  gasLimit?: number;
  allowUnlimitedContractSize?: boolean;
  fork?: string;
  unlocked_accounts?: string[];
};

export default async function(): Promise<string> {
  const server = fork(path.join(__dirname, 'ganache-server'), [], {
    // Prevent the child process from also being started in inspect mode, which
    // would cause issues due to parent and child sharing the port.
    // See https://github.com/OpenZeppelin/openzeppelin-test-environment/pull/23
    execArgv: process.execArgv.filter(opt => opt !== '--inspect'),
  });

  const options: NodeOptions = {
    ...config.node,
    accounts: accountsConfig,
    gasLimit: config.blockGasLimit,
    gasPrice: typeof config.gasPrice === 'string' ? config.gasPrice : undefined,
    coverage: config.coverage,
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
