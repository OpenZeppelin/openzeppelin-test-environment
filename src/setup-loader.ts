import { setupLoader } from '@openzeppelin/contract-loader';

import config from './config';
import { defaultSender } from './accounts';
import { provider } from './setup-provider';

if (config.contracts.type !== 'truffle' && config.contracts.type !== 'web3') {
  throw new Error(`Unknown contract type: '${config.contracts.type}'`);
}

export default setupLoader({
  defaultSender,
  defaultGas: config.contracts.defaultGas,
  provider,
})[config.contracts.type];
