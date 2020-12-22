import PQueue from 'p-queue';

import Web3 from 'web3';
import type { AbstractProvider } from 'web3-core';
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';

import setupGanache from './setup-ganache';
import config from './config';

type JsonRpcCallback = (error: Error | null, result?: JsonRpcResponse) => void;

export default class TestProvider implements AbstractProvider {
  private queue: PQueue;
  private wrappedProvider?: AbstractProvider;
  sendAsync: (payload: JsonRpcPayload, callback: JsonRpcCallback) => void;

  constructor() {
    this.sendAsync = this.send.bind(this);
    this.queue = new PQueue({ concurrency: 1 });

    this.queue.add(async () => {
      // Setup node
      const url = await setupGanache();
      // Create base provider (connection to node)
      const baseProvider = new Web3(url).eth.currentProvider;

      // Create a custom provider (e.g. GSN provider) and wrap it
      this.wrappedProvider = await config.setupProvider(baseProvider as AbstractProvider);
    });
  }

  public send(payload: JsonRpcPayload, callback: JsonRpcCallback): void {
    this.queue.onIdle().then(() => {
      // wrapped provider is always not a null due to PQueue running the provider initialization
      // before any send calls yet TypeScript can't possibly knows that
      this.wrappedProvider?.sendAsync(payload, callback);
    });
  }
}
