import tryRequire from 'try-require';
import semver from 'semver';

import { defaultSender } from './accounts';
import config from './config';
import { provider } from './setup-provider';
import { warn } from './log';

let configured = false;

const testHelpersPackage = tryRequire('@openzeppelin/test-helpers/package.json');
if (testHelpersPackage !== undefined) {
  // TODO: skip if already configured?

  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
      },
    });

    configured = true;
  } else if (semver.satisfies(version, '^0.5.0 <0.5.4')) {
    // Whitespaces indicate intersection ('and') in semver
    // Alternatively, 'environment' was available from 0.5.0, but the gas and
    // sender could not be configured
    configure({ provider, environment: config.contracts.type });

    configured = true;
  } else {
    warn(
      `Currently installed version of @openzeppelin/test-helpers (${version}) is unsupported, cannot configure.

Please upgrade to v0.5.0 or newer:
npm install --save-dev @openzeppelin/test-helpers@latest`,
    );
  }
}

export default configured;
