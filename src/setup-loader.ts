import { setupLoader } from '@openzeppelin/contract-loader';

import config from './config';
import { defaultSender } from './accounts';
import { provider } from './setup-provider';

if (config.contracts.type !== 'truffle' && config.contracts.type !== 'web3') {
  throw new Error(`Unknown contract type: '${config.contracts.type}'`);
}

export default setupLoader({
  provider,
  defaultSender,
  defaultGas: config.contracts.defaultGas,
  defaultGasPrice: config.contracts.defaultGasPrice,
  artifactsDir: config.contracts.artifactsDir,
})[config.contracts.type];
