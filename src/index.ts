import path from 'path';
import { fork, ChildProcess } from 'child_process';
import tryRequire from 'try-require';

import TestProvider from './TestProvider';
import { generateAccounts } from './accounts';

const port = '8548';
const { accountsConfig } = generateAccounts(10);

const server = fork(path.join(__dirname, 'server'));
server.send({ port, accountsConfig });

const provider = new TestProvider(`http://localhost:${port}`);

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

process.on('beforeExit', () => {
  server.kill();
});

const testHelpersConfigure = tryRequire('@openzeppelin/test-helpers/configure');
if (testHelpersConfigure !== undefined) {
  // TODO: skip if already configured?
  testHelpersConfigure({ provider });
}
