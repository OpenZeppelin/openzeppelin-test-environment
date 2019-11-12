import Web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';

import setupGanache from './setupGanache';
import config from './config';

export default class TestProvider implements Provider {
  private wrappedProvider?: Provider;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor() {
    this.sendAsync = this.send.bind(this);
  }

  public send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): void {
    if (this.wrappedProvider) {
      this.wrappedProvider.send(payload, callback);
    } else {
      // Setup node
      setupGanache()
        .then(
          url => {
            // Create base provider (connection to node)
            const baseProvider = new Web3(url).eth.currentProvider;

            // Create a custom provider (e.g. GSN provider) and wrap it
            return config.setupProvider(baseProvider as Provider);
          },
          error => {
            throw new Error(`Failed to start a local node: ${error}`);
          },
        )
        .then(
          provider => {
            this.wrappedProvider = provider;
            this.wrappedProvider.send(payload, callback);
          },
          error => {
            throw new Error(`Failed to wrap a provider: ${error}`);
          },
        );
    }
  }
}
