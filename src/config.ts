import fs from 'fs';
import findUp from 'find-up'

const CONFIG_FILE = '.test-env.js';
const location = findUp.sync(CONFIG_FILE, { type: 'file' });

const providedConfig = location !== undefined && fs.existsSync(location) ?
  require(location) :
  {};

const defaultConfig = {
  accounts: 10,
  gasLimit: 8e6,
  port: '8545',
};

export default { ...defaultConfig, ...providedConfig };
