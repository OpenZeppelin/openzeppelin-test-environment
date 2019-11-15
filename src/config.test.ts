import config, { DEFAULT_BLOCK_GAS_LIMIT } from './config';

const defaultConfig = {
  accounts: {
    amount: 10,
    ether: 100,
  },
  contracts: {
    type: 'web3',
    defaultGas: DEFAULT_BLOCK_GAS_LIMIT * 0.75,
  },

  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  gasPrice: 20e12,
};

describe('config', (): void => {
  it('provides default value', (): void => {
    expect(config).toMatchObject(defaultConfig);
  });
});
