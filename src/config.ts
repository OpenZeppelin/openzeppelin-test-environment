import fs from 'fs';
import findUp from 'find-up';
import merge from 'lodash.merge';

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
};

export default merge(defaultConfig, providedConfig);
