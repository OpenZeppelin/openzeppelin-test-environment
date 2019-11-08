import Web3 from 'web3';

import TestProvider from './TestProvider';
import config from './config';

import setupNode from './setup-node';

const provider = new TestProvider();

provider.enqueue(async () => {
  const url = await setupNode(provider);
  provider.host = url;
});

const web3 = new Web3(provider);

export { web3, provider };
