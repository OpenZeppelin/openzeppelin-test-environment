import ganacheNormal from 'ganache-core';
import ganacheCoverage from 'ganache-core-coverage';

import { Message, Options } from './setup-ganache';

function send(msg: Message): void {
  if (process.send === undefined) {
    throw new Error('Module must be started through child_process.fork');
  }
  process.send(msg);
}

process.once('message', (options: Options) => {
  const { accountsConfig, gasLimit, coverage } = options;

  const ganache = coverage ? ganacheCoverage : ganacheNormal;

  const server = ganache.server({
    accounts: accountsConfig,
    gasLimit,
    allowUnlimitedContractSize: coverage,
    emitFreeLogs: coverage,
  });

  // An undefined port number makes ganache-core choose a random free port,
  // which plays nicely with environments such as jest and ava, where multiple
  // processes of test-env may be run in parallel.
  // It also means however that the port (and therefore host URL) is not
  // available until the server finishes initialization.
  server.listen(undefined, function(err: unknown) {
    if (err) {
      send({ type: 'error' });
    } else {
      send({ type: 'ready', port: server.address().port });
    }
  });

  process.on('disconnect', () => {
    server.close();
  });
});
