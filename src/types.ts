import { Wallet } from 'ethereumjs-wallet';

export namespace GanacheServer {
  interface ErrorMessage {
    type: 'error';
  }

  interface ReadyMessage {
    type: 'ready';
    port: number;
  }

  export type Message = ErrorMessage | ReadyMessage;
}

export type WalletConfig = {
  balance: string;
  // do not change the name Ganache depends on it
  secretKey: string;
};

export type AccountsConfig = {
  accounts: string[];
  accountsConfig: WalletConfig[];
};
