import Web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';
import { HttpProvider } from 'web3-core';
import PQueue from 'p-queue';

export default class TestProvider implements HttpProvider {
  connected: boolean;

  // These are required by the HttpProvider interface
  supportsSubscriptions(): boolean {
    throw new Error('Method not implemented.');
  }

  disconnect(): boolean {
    throw new Error('Method not implemented.');
  }

  private _provider?: Provider;
  private _host?: string;
  private queue: PQueue;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor() {
    // TODO: forward these to the underlying provider
    this.connected = true;

    this.queue = new PQueue({ concurrency: 1 });

    this.sendAsync = this.send.bind(this);
  }

  get host(): string {
    if (this._host === undefined) {
      throw new Error('Host is not yet available');
    }

    return this._host;
  }

  set host(url: string) {
    if (this._host !== undefined) {
      throw new Error('Host is already set');
    }

    this._host = url;
  }

  get provider(): Provider {
    if (this._provider === undefined) {
      this._provider = new Web3.providers.HttpProvider(this.host);
    }
    return this._provider;
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
