import web3 from 'web3';
import { HttpProvider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';
import PQueue from 'p-queue';

export default class TestProvider {
  private provider: HttpProvider;
  private queue: PQueue;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor(host: string) {
    this.provider = new web3.providers.HttpProvider(host);

    this.queue = new PQueue({ concurrency: 1 });

    this.sendAsync = this.send.bind(this);
  }

  public enqueue<T>(asyncFn: () => PromiseLike<T>): void {
    this.queue.add(asyncFn);
  }

  public send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): void {
    this.queue.onIdle().then(() => {
      this.provider.send(payload, callback);
    });
  }
}
