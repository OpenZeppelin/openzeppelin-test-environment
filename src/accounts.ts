import wallet, { Wallet } from 'ethereumjs-wallet';

type WalletConfig = {
  balance: string;
  // do not change the name Ganache depends on it
  secretKey: string;
};

type AccountsConfig = {
  accounts: string[];
  accountsConfig: WalletConfig[];
};

function getConfig(wallet: Wallet): WalletConfig {
  return {
    balance: (1e18).toString(), // 1 ether
    secretKey: wallet.getPrivateKeyString(),
  };
}

export function generateAccounts(count: number): AccountsConfig {
  const wallets = Array.from({ length: count }, wallet.generate);
  const accounts = wallets.map(w => w.getChecksumAddressString());
  const accountsConfig = wallets.map(getConfig);
  return { accounts, accountsConfig };
}
