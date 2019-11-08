import Web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { provider } from 'web3-core';
import PQueue from 'p-queue';

import { WalletConfig } from './accounts';

export default class ExternalTestProvider implements Provider {
  private queue: PQueue;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor(private provider: Provider, accountsConfig: WalletConfig[]) {
    this.queue = new PQueue({ concurrency: 1 });

    this.sendAsync = this.send.bind(this);

    const web3 = new Web3(provider as provider);

    this.enqueue(async () => {
      // get base as a source of funding
      // we expect base account to be unlocked and funded
      const base = (await web3.eth.getAccounts())[0];
      // add and fund requested accounts
      for (const acc of accountsConfig) {
        const addedAccount = web3.eth.accounts.wallet.add(acc.secretKey);
        // TODO: super slow, optimize for speed
        console.log(addedAccount.address);
        await web3.eth.sendTransaction({ from: base, to: addedAccount.address, value: acc.balance });
      }
    });
  }

  public enqueue<T>(asyncFn: () => PromiseLike<T>): void {
    this.queue.add(asyncFn);
  }

  public send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): void {
    console.log(payload);
    this.queue.onIdle().then(() => {
      this.provider.send(payload, callback);
    });
  }
}
