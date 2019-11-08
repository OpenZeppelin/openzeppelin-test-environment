import { JsonRpcPayload } from 'web3-core-helpers';

declare module 'web3-core-helpers' {
  class ProviderBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(payload: JsonRpcPayload, callback: (error: Error, result: any) => void): void;
  }
}
