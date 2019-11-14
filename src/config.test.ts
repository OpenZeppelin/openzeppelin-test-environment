import config from './config';

const defaultConfig = {
  accounts: {
    amount: 10,
    ether: 100,
  },
  gasLimit: 8e6,
};

describe('config', (): void => {
  it('provides default value', (): void => {
    expect(config).toMatchObject(defaultConfig);
  });
});
