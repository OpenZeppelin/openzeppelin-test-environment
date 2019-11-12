declare module 'ethereumjs-wallet' {
  function generate(): Wallet;

  class Wallet {
    getPrivateKeyString(): string;
    getAddress(): Buffer;
    getChecksumAddressString(): string;
  }
}
