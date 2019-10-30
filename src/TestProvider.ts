import web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';
import { HttpProvider } from 'web3-core';
import PQueue from 'p-queue';

export default class TestProvider implements HttpProvider {
  host: string;
  connected: boolean;

  supportsSubscriptions(): boolean {
    throw new Error('Method not implemented.');
  }

  disconnect(): boolean {
    throw new Error('Method not implemented.');
  }

  private provider: Provider;
  private queue: PQueue;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor(host: string) {
    this.host = host;
    this.connected = true;
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
