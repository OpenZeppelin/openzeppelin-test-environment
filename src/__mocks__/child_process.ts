export const fork = jest.fn(() => {
  return {
    send: jest.fn(),
    once: jest.fn((event: string, listener: any) => {
      listener({
        type: 'ready',
        port: 42,
      });
    }),
    unref: jest.fn(),
  };
});
