import fs from 'fs';
import findUp from 'find-up';
import merge from 'lodash.merge';

import { Provider } from 'web3/providers';

const CONFIG_FILE = '.test-env.js';
const location = findUp.sync(CONFIG_FILE, { type: 'file' });

const providedConfig = location !== undefined && fs.existsSync(location) ?
  require(location) :
  {};

const defaultConfig = {
  accounts: {
    amount: 10,
    ether: 100,
  },
  gasLimit: 8e6,
  setupProvider: async (baseProvider: Provider): Promise<Provider> => baseProvider,
};

export default merge(defaultConfig, providedConfig);
