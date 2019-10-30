import { web3 } from './web3';
import fs from 'fs';
import { Contract } from 'web3-eth-contract';

export default function(contract: string): Contract {
  const { abi, bytecode } = JSON.parse(fs.readFileSync(`./build/contracts/${contract}.json`, 'utf8'));
  return new web3.eth.Contract(abi, undefined, { data: bytecode });
}
