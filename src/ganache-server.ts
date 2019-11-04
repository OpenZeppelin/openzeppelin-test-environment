import ganache from 'ganache-core';

import { Message } from './types';

function send(msg: Message): void {
  if (process.send === undefined) {
    throw new Error('Module must be started through child_process.fork');
  }
  process.send(msg);
}

process.once('message', options => {
  const { port, accountsConfig, gasLimit } = options;
  const server = ganache.server({ accounts: accountsConfig, gasLimit });

  server.listen(port, function(err: unknown) {
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
