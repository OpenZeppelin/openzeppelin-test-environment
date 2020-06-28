import { once } from 'events';
import { fork, execSync } from 'child_process';
import path from 'path';
import { existsSync, renameSync } from 'fs';
import { removeSync, moveSync } from 'fs-extra';

export function cleanUp(): void {
  if (existsSync('./contracts-backup/')) {
    moveSync('./contracts-backup', './contracts', { overwrite: true });
  }
  removeSync('./contracts-backup/');
  removeSync('./build/contracts/');
  removeSync('./.coverage_artifacts/');
  removeSync('./.coverage_contracts/');
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
export async function runCoverage(skipFiles: string[], compileCommand: string, testCommand: string[]): Promise<void> {
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
    renameSync('./contracts/', './contracts-backup');
    renameSync('./.coverage_contracts/', './contracts/');

    // compile instrumented contracts
    execSync(compileCommand);

    // run tests
    const fokred = fork(testCommand[0], testCommand.slice(1), {
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
    process.exitCode = 1;
  } finally {
    await utils.finish(config, api);
    cleanUp();
  }
}
