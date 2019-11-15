declare module 'ganache-core-coverage' {
  import ganache from 'ganache-core';

  interface ServerCoverageOptions extends ganache.IServerOptions {
    emitFreeLogs: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function server(options?: ServerCoverageOptions): any;
}
