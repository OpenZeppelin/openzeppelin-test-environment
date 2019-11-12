import setupGanache from './setup-ganache';
import TestProvider from './TestProvider';

export default async function(): Promise<string> {
  const url = await setupGanache();
  return url;
}
