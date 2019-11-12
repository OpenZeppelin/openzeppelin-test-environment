import Web3 from 'web3';
import { provider } from 'web3-core';

import TestProvider from './TestProvider';
import config from './config';
import setupNode from './setup-node';

const provider = new TestProvider();

provider.enqueue(async () => {
  // Setup node
  const url = await setupNode();

  // Create base provider (connection to node)
  const baseProvider = new Web3(url).eth.currentProvider;

  // Create a custom provider (e.g. GSN provider) and wrap it
  provider.wrappedProvider = await config.setupProvider(baseProvider);
});

// because web3 types is a joke
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const web3 = new Web3(provider as any);

export { web3, provider };
