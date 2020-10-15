import fs from 'fs';
import findUp from 'find-up';
import merge from 'lodash.merge';

import { warn } from './log';

import { Provider } from 'web3/providers';

const CONFIG_FILE = 'test-environment.config.js';

const configHelpUrl = 'https://zpl.in/test-env-config';

export type Config = {
  accounts: { amount: number; ether: number };
  contracts: { type: string; defaultGas: number; defaultGasPrice: number; artifactsDir: string };
  blockGasLimit?: number;
  gasPrice?: number;
  setupProvider: (baseProvider: Provider) => Promise<Provider>;
  coverage: boolean;
  node: {
    gasLimit?: number;
    gasPrice?: number | string;
    allowUnlimitedContractSize?: boolean;
    // {url:port@blocknumber} for example http://localhost:8545@1599200
    fork?: string;
    port?: number;
    unlocked_accounts?: string[];
  };
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

  setupProvider: async (baseProvider) => baseProvider,

  coverage: false,

  node: {
    allowUnlimitedContractSize: false,
    gasLimit: DEFAULT_BLOCK_GAS_LIMIT,
    gasPrice: 20e9, // 20 gigawei
  },
};

export function getConfig(): Config {
  const location = findUp.sync(CONFIG_FILE, { type: 'file' });
  const providedConfig: Partial<Config> = location !== undefined && fs.existsSync(location) ? require(location) : {};

  if (providedConfig.blockGasLimit !== undefined) {
    warn(`blockGasLimit is deprecated. Use node.gasLimit instead. See ${configHelpUrl} for details.`);
  }

  if (providedConfig.gasPrice !== undefined) {
    warn(`Please move gasPrice option inside node option. See ${configHelpUrl} for more details.`);
  }

  if (providedConfig.gasPrice !== undefined && providedConfig.node?.gasPrice !== undefined) {
    throw new Error(
      `GasPrice is specified twice in config. Please fix your config. See ${configHelpUrl} for more details.`,
    );
  }

  if (!!providedConfig.blockGasLimit && !!providedConfig.node?.gasLimit) {
    throw new Error(
      `GasLimit is specified twice in config. Please fix your config. See ${configHelpUrl} for more details.`,
    );
  }

  const config: Config = merge(defaultConfig, providedConfig);

  if (config.gasPrice !== undefined) config.node.gasPrice = config.gasPrice;
  if (config.blockGasLimit) config.node.gasLimit = config.blockGasLimit;

  if (config.node.gasPrice !== undefined && typeof config.node.gasPrice !== 'string')
    config.node.gasPrice = `0x${config.node.gasPrice.toString(16)}`;

  if (process.env.OZ_TEST_ENV_COVERAGE !== undefined) {
    config.coverage = true;
    config.contracts.defaultGas = 0xffffffffff;
    config.contracts.defaultGasPrice = 1;
  }

  return config;
}

export default getConfig();
