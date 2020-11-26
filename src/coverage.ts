import { once } from 'events';
import { log } from './log';
import { fork, execSync } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';
import { removeSync, moveSync } from 'fs-extra';
import exitHook from 'exit-hook';

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
      log: (msg: string): void => log(msg),
    },
  };

  try {
    const { tempContractsDir, tempArtifactsDir } = utils.getTempLocations(config);

    function cleanUp(): void {
      if (existsSync('./contracts-backup/')) {
        moveSync('./contracts-backup', './contracts', { overwrite: true });
      }
      removeSync('./build/contracts/');
      removeSync(tempArtifactsDir);
      removeSync(tempContractsDir);
    }

    exitHook(cleanUp);

    utils.setupTempFolders(config, tempContractsDir, tempArtifactsDir);

    const { targets, skipped } = utils.assembleFiles(config, skipFiles);
    const instrumented = api.instrument(targets);
    utils.save(instrumented, config.contractsDir, tempContractsDir);
    utils.save(skipped, config.contractsDir, tempContractsDir);

    // backup original contracts
    moveSync('./contracts/', './contracts-backup');
    moveSync(tempContractsDir, './contracts/');

    // compile instrumented contracts
    execSync(compileCommand);

    // run tests
    const forked = fork(testCommand[0], testCommand.slice(1), {
      env: {
        ...process.env,
        cwd: __dirname,
        OZ_TEST_ENV_COVERAGE: 'TRUE',
      },
    });

    const [accounts] = await once(forked, 'message');
    api.providerOptions = { accounts: accounts };

    // run Ganache
    const address = await api.ganache();

    // start test-env tests
    forked.send(address);

    // wait for the tests to finish
    await once(forked, 'close');

    // Clean up before writing report
    cleanUp();

    // write a report
    await api.report();
  } catch (e) {
    log(e);
    process.exitCode = 1;
  } finally {
    await utils.finish(config, api);
  }
}
