import { once } from 'events';
import { fork, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export function cleanUp(): void {
  if (fs.existsSync('./contracts-backup/')) {
    execSync('cp -rf ./contracts-backup/ ./contracts');
  }
  execSync('rm -rf ./contracts-backup/');
  execSync('rm -rf ./build/contracts/');
  execSync('rm -rf ./.coverage_artifacts/');
  execSync('rm -rf ./.coverage_contracts/');
}

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  process.on(signal, () => {
    cleanUp();
    process.exit();
  }),
);

/* eslint-disable @typescript-eslint/no-var-requires */
export async function runCoverage(skipFiles: string[], compileCommand: string, testCommand: string): Promise<void> {
  const client = require('ganache-cli');
  const CoverageAPI = require('solidity-coverage/api');
  const utils = require('solidity-coverage/utils');

  const api = new CoverageAPI({ client });

  const config = {
    workingDir: process.cwd(),
    contractsDir: path.join(process.cwd(), 'contracts'),
    logger: {
      log: (msg: string): void => console.log(msg),
    },
  };

  try {
    const { tempContractsDir, tempArtifactsDir } = utils.getTempLocations(config);
    utils.setupTempFolders(config, tempContractsDir, tempArtifactsDir);

    const { targets } = utils.assembleFiles(config, skipFiles);
    const instrumented = api.instrument(targets);
    utils.save(instrumented, config.contractsDir, tempContractsDir);

    // backup original contracts
    execSync('cp -rf ./contracts/ ./contracts-backup');
    execSync(`cp -rf ./.coverage_contracts/ ./contracts`);

    // compile instrumented contracts
    execSync(compileCommand);

    // run tests
    const fokred = fork(testCommand.split(' ')[0], testCommand.split(' ').slice(1), {
      env: {
        ...process.env,
        cwd: __dirname,
        OZ_TEST_ENV_COVERAGE: 'TRUE',
      },
    });

    const [accounts] = await once(fokred, 'message');
    api.providerOptions = { accounts: accounts };

    // run Ganache
    const address = await api.ganache();

    // start test-env tests
    fokred.send(address);

    // wait for the tests to finish
    await once(fokred, 'close');

    // write a report
    await api.report();
  } catch (e) {
    console.log(e);
  } finally {
    await utils.finish(config, api);
    cleanUp();
  }
}
