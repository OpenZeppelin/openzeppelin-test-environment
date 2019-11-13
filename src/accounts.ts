import wallet, { Wallet } from 'ethereumjs-wallet';
import Web3 from 'web3';

import config from './config';
import { AccountsConfig, WalletConfig } from './types';

const { utils } = Web3;

function getConfig(ether: number) {
  return function(wallet: Wallet): WalletConfig {
    return {
      balance: utils.toWei(ether.toString(), 'ether'),
      secretKey: wallet.getPrivateKeyString(),
    };
  };
}

function generateAccounts(count: number, ether: number): AccountsConfig {
  const wallets = Array.from({ length: count }, wallet.generate);
  const accounts = wallets.map(w => w.getChecksumAddressString());
  const accountsConfig = wallets.map(getConfig(ether));
  return { accounts, accountsConfig };
}

const { accounts: allAccounts, accountsConfig } = generateAccounts(
  config.accounts.amount + 1, // extra account for the default sender
  config.accounts.ether,
);

// We use the first account as the default sender (when no sender is specified),
// which provides versatility for tests where this sender is not important
// (e.g. when calling view functions).
// We also don't expose this account so that it is not possible to explicitly
// use it, creating a scenario where the default account and an explicit account
// are the same one, which can create hard to debug failing tests.

const defaultSender = allAccounts[0];
const accounts = allAccounts.slice(1);

export { accounts, accountsConfig, defaultSender };
