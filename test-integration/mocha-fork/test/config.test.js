const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const BN = require('bn.js');
const { expect } = require('chai');

const DAI = contract.fromArtifact('Dai');

const { first } = accounts;

describe('forked blockchain', function() {
  it('gets correct name for DAI stablecoin', async function() {
    const inst = await DAI.at('0x6B175474E89094C44Da98b954EedeAC495271d0F');
    const name = await inst.name();
    expect(name).to.be.eq('Dai Stablecoin');
  });
  it('gets a contracts bytecode', async function() {
    const code = await web3.eth.getCode('0x6B175474E89094C44Da98b954EedeAC495271d0F');
    expect(code).to.match(/0x608060405234801561001057600080fd5b50600436106101425760003560e01c80637ecebe001/);
  });
  it('can spend Vitalik ether', async function() {
    const hash = await web3.eth.sendTransaction({
      from: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      to: first,
      value: web3.utils.toWei('1000', 'ether'),
    });
    expect(hash.transactionHash).to.not.be.undefined;
  });
});
