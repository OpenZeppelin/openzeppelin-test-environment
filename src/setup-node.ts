import setupGanache from './setup-ganache';
import TestProvider from './TestProvider';

export default async function(provider: TestProvider): Promise<string> {
  const url = await setupGanache(provider);
  return url;
}
