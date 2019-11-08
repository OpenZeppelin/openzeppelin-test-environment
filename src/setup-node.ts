import setupGanache from './setup-ganache';
import TestProvider from './TestProvider';
import config from './config';

export default async function (provider: TestProvider): Promise<string> {
  const url = await setupGanache(provider);
  return url;
}
