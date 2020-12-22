import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';

export type JsonRpcCallback = (error: Error | null, result?: JsonRpcResponse) => void;

export interface Provider {
  send(payload: JsonRpcPayload, callback: JsonRpcCallback): void;
}
