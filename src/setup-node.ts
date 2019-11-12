import setupGanache from './setup-ganache';

export default async function(): Promise<string> {
  const url = await setupGanache();
  return url;
}
