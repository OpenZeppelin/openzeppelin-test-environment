/* eslint-disable @typescript-eslint/ban-ts-ignore */
import PQueue from 'p-queue';
import type { JsonRpcPayload } from 'web3-core-helpers';

import { mocked } from 'ts-jest/utils';

import { flushPromises } from './utils';
import TestProvider from './test-provider';
import config from './config';
import setupGanache from './setup-ganache';

jest.mock('p-queue');
const mockedPQueue = mocked(PQueue, true);

jest.mock('./config');
const mockedConfig = mocked(config, true);

jest.mock('./setup-ganache');
const mockedGanache = mocked(setupGanache);

describe('TestProvider class', (): void => {
  let provider: TestProvider;
  beforeEach(() => {
    provider = new TestProvider();
  });

  it('constructs TestProvider instance', async () => {
    expect(mockedPQueue).toHaveBeenCalled();
    const queueInstance = mockedPQueue.mock.instances[0];
    expect(queueInstance.add).toHaveBeenCalled();

    const addFunc = mocked(queueInstance.add).mock.calls[0][0];
    await addFunc();
    expect(mockedGanache).toHaveBeenCalled();

    expect(mockedConfig.setupProvider).toHaveBeenCalled();
  });

  it('sends a request', async () => {
    const request: JsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'web3_getAllTheMoney',
      params: [],
      id: 324,
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const callback = (): void => {};

    // @ts-ignore
    provider.queue.onIdle = jest.fn((): Promise<void> => Promise.resolve());
    // @ts-ignore
    provider.wrappedProvider = {
      send: jest.fn(),
    };

    provider.send(request, callback);

    await flushPromises();

    // @ts-ignore
    expect(provider.queue.onIdle).toHaveBeenCalled();

    // @ts-ignore
    expect(provider.wrappedProvider.send).toHaveBeenCalledWith(request, callback);
  });
});
