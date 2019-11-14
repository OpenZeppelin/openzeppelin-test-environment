import PQueue from 'p-queue';

import Web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';

import setupGanache from './setup-ganache';
import config from './config';

export default class TestProvider implements Provider {
  private queue: PQueue;
  private wrappedProvider?: Provider;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor() {
    this.sendAsync = this.send.bind(this);
    this.queue = new PQueue({ concurrency: 1 });

    this.queue.add(async () => {
      // Setup node
      const url = await setupGanache();
      // Create base provider (connection to node)
      const baseProvider = new Web3(url).eth.currentProvider;

      // Create a custom provider (e.g. GSN provider) and wrap it
      this.wrappedProvider = await config.setupProvider(baseProvider as Provider);
    });
  }

  public send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): void {
    this.queue.onIdle().then(() => {
      // wrapped provider is always not a null due to PQueue running the provider initialization
      // before any send calls yet TypeScript can't possibly knowts that
      this.wrappedProvider && this.wrappedProvider.send(payload, callback);
    });
  }
}
