import { DEFAULT_BLOCK_GAS_LIMIT, Config, getConfig } from './config';

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
    gasPrice: '0x4a817c800', // 20 gigawei
  },
};

const coverageConfig: Config = {
  accounts: {
    amount: 10,
    ether: 100,
  },

  contracts: {
    type: 'truffle',
    defaultGas: 0xffffffffff,
    defaultGasPrice: 1,
    artifactsDir: 'build/contracts',
  },

  setupProvider: async (baseProvider) => baseProvider,

  coverage: true,

  node: {
    allowUnlimitedContractSize: false,
    gasLimit: DEFAULT_BLOCK_GAS_LIMIT,
    gasPrice: '0x4a817c800', // 20 gigawei
  },
};

describe('config', (): void => {
  it('provides default value', (): void => {
    // because setupProvider wouldn't match with toEqual
    const config = getConfig();
    expect(JSON.stringify(config)).toBe(JSON.stringify(defaultConfig));
  });
  it('provide correct config for coverage', (): void => {
    process.env.OZ_TEST_ENV_COVERAGE = 'true';
    const config = getConfig();
    expect(JSON.stringify(config)).toBe(JSON.stringify(coverageConfig));
    process.env.OZ_TEST_ENV_COVERAGE = undefined;
  });
});
