import fs from 'fs';
import findUp from 'find-up';
import merge from 'lodash.merge';

import { Provider } from 'web3/providers';

const CONFIG_FILE = 'test-env.config.js';
const location = findUp.sync(CONFIG_FILE, { type: 'file' });

type Config = {
  accounts: { amount: number; ether: number };
  contracts: { type: string; defaultGas: number };
  blockGasLimit: number;
  setupProvider: (baseProvider: Provider) => Promise<Provider>;
};

const providedConfig: Partial<Config> = location !== undefined && fs.existsSync(location) ? require(location) : {};

export const DEFAULT_GAS_LIMIT = 8e6;

const defaultConfig: Config = {
  accounts: {
    amount: 10,
    ether: 100,
  },

  contracts: {
    type: 'web3',
    defaultGas: DEFAULT_GAS_LIMIT * 0.75,
  },

  blockGasLimit: DEFAULT_GAS_LIMIT,

  setupProvider: async baseProvider => baseProvider,
};

export default merge(defaultConfig, providedConfig);
