import Web3 from 'web3';
import { Provider, JsonRPCRequest, Callback, JsonRPCResponse } from 'web3/providers';
import { HttpProvider } from 'web3-core';
import PQueue from 'p-queue';

import { ChildProcess } from 'child_process';

import { Message } from './types';

interface Pipe {
  unref(): unknown;
}

export default class TestProvider implements HttpProvider {
  connected: boolean;
  private _provider?: Provider;
  _port?: number;
  private queue: PQueue;
  private sendAsync: (payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>) => void;

  constructor(server: ChildProcess) {
    // TODO: forward these to the underlying provider
    this.connected = true;

    this.queue = new PQueue({ concurrency: 1 });

    this.sendAsync = this.send.bind(this);

    const messageReceived: Promise<Message> = new Promise(
      (resolve): ChildProcess => {
        return server.once('message', resolve);
      },
    );

    this.enqueue(async () => {
      const message = await messageReceived;

      switch (message.type) {
        case 'error':
          server.kill();
          break;
        case 'ready':
          (server.channel as Pipe).unref(); // The type of server.channel is missing unref
          server.unref();
          this._port = message.port;
          break;
        default:
          throw new Error(`Uknown internal error ${message}`);
      }
    });
  }

  get host(): string {
    if (this._port === undefined) {
      throw new Error('Host is not yet available');
    } else {
      return `http://localhost:${this._port}`;
    }
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

  // These are required by the HttpProvider interface
  supportsSubscriptions(): boolean {
    throw new Error('Method not implemented.');
  }

  disconnect(): boolean {
    throw new Error('Method not implemented.');
  }
}
