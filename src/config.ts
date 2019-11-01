import fs from 'fs';

const CONFIG_FILE = '.test-env.js';
const providedConfig = fs.existsSync(CONFIG_FILE) ? require(CONFIG_FILE) : {};

const defaultConfig = {
  accounts: 10,
  gasLimit: 8e6,
  port: '8545',
};

export default { ...defaultConfig, ...providedConfig };
