import Web3 from 'web3';
import { privateToAddress, toChecksumAddress } from 'ethereumjs-util';

import { generateAccounts } from './accounts';

describe('generateAccounts function', (): void => {
  it('generates a required number of accounts with a right amount of ether', (): void => {
    const accountsNumber = 34;
    const balance = 234324;
    const config = generateAccounts(accountsNumber, balance);

    expect(config.accounts.length).toBe(accountsNumber);
    expect(config.privateKeys.length).toBe(accountsNumber);
    expect(config.accountsConfig.length).toBe(accountsNumber);

    config.privateKeys.forEach((privateKey, index) => {
      const address = privateToAddress(Buffer.from(privateKey.replace(/0x/, ''), 'hex'));
      const checksumAddress = toChecksumAddress(address.toString('hex'));
      expect(checksumAddress).toBe(config.accounts[index]);
    });

    for (const account of config.accountsConfig) {
      expect(account.balance).toBe(Web3.utils.toWei(balance.toString(), 'ether'));
    }
  });
});
