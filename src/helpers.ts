import tryRequire from 'try-require';
import semver from 'semver';

import { defaultSender } from './accounts';
import config from './config';
import { provider } from './setupProvider';

const colors = require('ansi-colors');

let configured = false;

const testHelpersPackage = tryRequire('@openzeppelin/test-helpers/package.json');
if (testHelpersPackage !== undefined) {
  // TODO: skip if already configured?
  const configure = require('@openzeppelin/test-helpers/configure');

  const version = testHelpersPackage.version;
  if (semver.satisfies(version, '^0.5.4')) {
    // The 'singletons' field was introduced in 0.5.4
    configure({
      provider,
      singletons: {
        abstraction: config.contracts.type,
        defaultGas: config.contracts.defaultGas,
        defaultSender,
      }
    });

    configured = true;

  } else if (semver.satisfies(version, '^0.5.0 <0.5.4')) { // Whitespaces indicate intersection ('and') in semver
    // Alternatively, 'environment' was available from 0.5.0, but the gas and
    // sender could not be configured
    configure({ provider, environment: config.contracts.type });

    configured = true;

  } else {
    const warn = (msg: string) => {
      console.log(`${colors.white.bgBlack('@openzeppelin/test-env')} ${colors.black.bgYellow('WARN')} ${msg}`);
    };

    warn(`Unknown version of @openzeppelin/test-helpers: '${version}', cannot configure`);
  }
}

export default configured;
