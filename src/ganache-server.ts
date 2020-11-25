import ganache from 'ganache-core';
import events from 'events';

import type { Message, NodeOptions } from './setup-ganache';
import type { Server } from 'net';
import { Config, getConfig } from './config';

function send(msg: Message): void {
  if (process.send === undefined) {
    throw new Error('Module must be started through child_process.fork');
  }
  process.send(msg, (err: Error) => {
    if (err) process.exit();
  });
}

function setupServer(nodeOptions: any): Server {
  if (!nodeOptions.coverage) {
    return ganache.server(nodeOptions);
  } else {
    return require('ganache-core-coverage').server({
      ...nodeOptions,
      emitFreeLogs: true,
      allowUnlimitedContractSize: true,
    });
  }
}

process.once('message', async (options: NodeOptions) => {
  const config: Config = getConfig();
  const server: Server = setupServer({ ...options, ...config.node });

  process.on('disconnect', () => {
    server.close();
  });

  // An undefined port number makes ganache-core choose a random free port,
  // which plays nicely with environments such as jest and ava, where multiple
  // processes of test-environment may be run in parallel.
  // It also means however that the port (and therefore host URL) is not
  // available until the server finishes initialization.
  server.listen(undefined);

  try {
    await events.once(server, 'listening');
    const addr = server.address();
    if (typeof addr === 'object' && addr !== null) {
      send({ type: 'ready', port: addr.port });
    } else {
      send({ type: 'error' });
    }
  } catch (err) {
    send({ type: 'error' });
  }
});
