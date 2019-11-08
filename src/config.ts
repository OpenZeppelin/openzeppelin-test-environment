import fs from 'fs';
import findUp from 'find-up';
import merge from 'lodash.merge';

import { Provider } from 'web3/providers';

const CONFIG_FILE = '.test-env.js';
const location = findUp.sync(CONFIG_FILE, { type: 'file' });

type Config = {
  accounts: { amount: number; ether: number };
  gasLimit: number;
  provider?: Provider;
};

const providedConfig: Partial<Config> = location !== undefined && fs.existsSync(location) ? require(location) : {};

const defaultConfig: Config = {
  accounts: {
    amount: 10,
    ether: 100,
  },
  gasLimit: 8e6,
};

export default merge(defaultConfig, providedConfig);
