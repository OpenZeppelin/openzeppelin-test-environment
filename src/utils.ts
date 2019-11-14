export function flushPromises(): Promise<void> {
  return new Promise((resolve): NodeJS.Immediate => setImmediate(resolve));
}
