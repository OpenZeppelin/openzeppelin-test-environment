import tryRequire from 'try-require';

import { provider } from './setup-node';

const testHelpersConfigure = tryRequire('@openzeppelin/test-helpers/configure');
if (testHelpersConfigure !== undefined) {
  // TODO: skip if already configured?
  testHelpersConfigure({ provider });
}

export default testHelpersConfigure !== undefined;
