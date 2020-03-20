import config, { DEFAULT_BLOCK_GAS_LIMIT } from './config';

const defaultConfig = {
  accounts: {
    amount: 10,
    ether: 100,
  },
  contracts: {
    type: 'truffle',
    defaultGas: DEFAULT_BLOCK_GAS_LIMIT * 0.75,
  },

  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  gasPrice: 20e9,
  allowUnlimitedContractSize: false,
};

describe('config', (): void => {
  it('provides default value', (): void => {
    expect(config).toMatchObject(defaultConfig);
  });
});
