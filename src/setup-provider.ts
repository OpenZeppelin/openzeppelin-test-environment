import Web3 from 'web3';
// @ts-expect-error
import { provider } from 'web3-core';

import TestProvider from './test-provider';

const provider = new TestProvider();

// because web3 types is a joke
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const web3 = new Web3(provider as any);

export { web3, provider };
