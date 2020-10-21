import path from 'path';
import { fork, ChildProcess } from 'child_process';
import events from 'events';

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

export type NodeOptions = {
  accounts: AccountConfig[];
  coverage: boolean;
  gasPrice?: string;
  gasLimit?: number;
  allowUnlimitedContractSize?: boolean;
  fork?: string;
  unlocked_accounts?: string[];
};

export default async function (): Promise<string> {
  if (!config.coverage) {
    const server = fork(path.join(__dirname, 'ganache-server'), [], {
      // Prevent the child process from also being started in inspect mode, which
      // would cause issues due to parent and child sharing the port.
      // See https://github.com/OpenZeppelin/openzeppelin-test-environment/pull/23
      execArgv: process.execArgv.filter((opt) => opt !== '--inspect'),
    });

    const gasPrice = typeof config.node.gasPrice === 'string' ? config.node.gasPrice : undefined;

    const options: NodeOptions = {
      ...config.node,
      gasPrice,
      accounts: accountsConfig,
      coverage: config.coverage,
    };
    server.send(options);

    const [message]: Message[] = await events.once(server, 'message');

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
  } else {
    if (process.send === undefined) {
      throw new Error('Module must be started through child_process.fork for solidity-coverage support.');
    }
    process.send(accountsConfig);
    const address: string = await new Promise(
      (resolve): NodeJS.Process => {
        return process.on('message', resolve);
      },
    );
    return address;
  }
}
