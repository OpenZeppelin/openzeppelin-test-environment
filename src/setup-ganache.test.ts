import setupGanache from './setup-ganache';
import { mocked } from 'ts-jest/utils';
import { fork } from 'child_process';
import config from './config';
import { accountsConfig } from './accounts';

jest.mock('child_process');

describe('setupGanache', (): void => {
  it('forks ganache-server', async (): Promise<void> => {
    const forkMock = mocked(fork);
    expect(await setupGanache()).toBe('http://localhost:42');
    expect(fork).toHaveBeenCalled();
    const server = forkMock.mock.results[0];
    expect(server.value.once).toHaveBeenCalled();
    expect(server.value.unref).toHaveBeenCalled();
  });

  it('sends accounts in coverage mode', async (): Promise<void> => {
    config.coverage = true;
    const mockSend = jest.spyOn(process, 'send').mockImplementation(() => {
      return true;
    });
    const mockOn = jest.spyOn(process, 'on').mockImplementation((message, resolve) => {
      const trueResolve = resolve as (message: any, sendHandle: any) => void;
      trueResolve('42', undefined);
      return process;
    });
    expect(await setupGanache()).toBe('42');
    expect(mockSend).toHaveBeenCalledWith(accountsConfig);
    config.coverage = false;
    mockSend.mockRestore();
    mockOn.mockRestore();
  });
});
