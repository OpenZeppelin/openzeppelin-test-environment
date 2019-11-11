import Web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';
import PQueue from 'p-queue';

export default class TestProvider extends Provider {
  private _wrappedProvider?: Provider;
  private queue: PQueue;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor() {
    super();

    this.queue = new PQueue({ concurrency: 1 });

    this.sendAsync = this.send.bind(this);
  }

  get wrappedProvider(): Provider {
    if (this._wrappedProvider === undefined) {
      throw new Error('Base provider is not yet available');
    }

    return this._wrappedProvider;
  }

  set wrappedProvider(wrappedProvider: Provider) {
    if (this._wrappedProvider !== undefined) {
      throw new Error('Base provider already set');
    }

    this._wrappedProvider = wrappedProvider;
  }

  public enqueue<T>(asyncFn: () => PromiseLike<T>): void {
    this.queue.add(asyncFn);
  }

  public send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): void {
    this.queue.onIdle().then(() => {
      this.wrappedProvider.send(payload, callback);
    });
  }
}
