import ganache from 'ganache-core';

process.once('message', options => {
  const { port, accountsConfig } = options;
  const server = ganache.server({ accounts: accountsConfig });

  server.listen(port, function(err: unknown) {
    if (err) {
      process.send && process.send('error');
    } else {
      process.send && process.send('ready');
    }
  });

  process.on('SIGTERM', () => {
    server.close();
  });
});
