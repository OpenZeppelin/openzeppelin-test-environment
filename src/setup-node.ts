import setupGanache from './setup-ganache';
import TestProvider from './TestProvider';
import config from './config';

export default async function (): Promise<string> {
  const url = await setupGanache();
  return url;
}
