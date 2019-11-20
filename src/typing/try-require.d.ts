declare module 'try-require' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function require(module: string): any;

  namespace require {
    function resolve(module: string): string;
  }

  export = require;
}
