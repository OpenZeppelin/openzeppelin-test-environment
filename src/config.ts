import fs from 'fs';
import findUp from 'find-up';
import merge from 'lodash.merge';
import tryRequire from 'try-require'

import { log } from './log';

import { Provider } from 'web3/providers';

const CONFIG_FILE = 'test-environment.config.js';

type Config = {
  accounts: { amount: number; ether: number };
  contracts: { type: string; defaultGas: number, defaultGasPrice: number, artifactsDir: string, };
  blockGasLimit: number;
  gasPrice: number;
  setupProvider: (baseProvider: Provider) => Promise<Provider>;
  coverage: boolean;
  allowUnlimitedContractSize: boolean;
};

export const DEFAULT_BLOCK_GAS_LIMIT = 8e6;

const defaultConfig: Config = {
  accounts: {
    amount: 10,
    ether: 100,
  },

  contracts: {
    type: 'truffle',
    defaultGas: DEFAULT_BLOCK_GAS_LIMIT * 0.75,
    defaultGasPrice: 20e9, // 20 gigawei
    artifactsDir: 'build/contracts',
  },

  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  gasPrice: 20e9, // 20 gigawei

  setupProvider: async baseProvider => baseProvider,

  coverage: false,
  allowUnlimitedContractSize: false,
};

function getConfig(): Config {
  const location = findUp.sync(CONFIG_FILE, { type: 'file' });
  const providedConfig: Partial<Config> = location !== undefined && fs.existsSync(location) ? require(location) : {};

  const config: Config = merge(defaultConfig, providedConfig);

  if (process.env.OZ_TEST_ENV_COVERAGE !== undefined) {
    const coveragePath = tryRequire.resolve('ganache-core-coverage');
    if (coveragePath === undefined) {
      throw new Error(`Package 'ganache-core-coverage' is required for coverage runs.`);
    }

    log('Running on coverage mode: overriding some configuration values');
    config.coverage = true;

    // Solidity coverage causes transactions to require much more gas. We need to:
    //  1. increase the block gas limit so that transactions don't go over it
    //  2. increase how much gas transactions send by default
    //  3. reduce the gas price to prevent the account's funds from being affected by this too much

    config.blockGasLimit = 0xfffffffffffff;
    config.contracts.defaultGas = config.blockGasLimit * 0.75;
    config.contracts.defaultGasPrice = 1;
    config.gasPrice = 1;
  }

  return config;
}

export default getConfig();
