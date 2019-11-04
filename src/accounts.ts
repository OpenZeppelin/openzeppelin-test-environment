import wallet, { Wallet } from 'ethereumjs-wallet';
import Web3  from 'web3';
const { utils } = Web3;

type WalletConfig = {
  balance: string;
  // do not change the name Ganache depends on it
  secretKey: string;
};

type AccountsConfig = {
  accounts: string[];
  accountsConfig: WalletConfig[];
};

function getConfig(ether: number) {
  return function (wallet: Wallet): WalletConfig {
    return {
      balance: utils.toWei(ether.toString(), 'ether'),
      secretKey: wallet.getPrivateKeyString(),
    };
  }
}

export function generateAccounts(count: number, ether: number): AccountsConfig {
  const wallets = Array.from({ length: count }, wallet.generate);
  const accounts = wallets.map(w => w.getChecksumAddressString());
  const accountsConfig = wallets.map(getConfig(ether));
  return { accounts, accountsConfig };
}
