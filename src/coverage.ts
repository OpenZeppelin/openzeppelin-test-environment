/* eslint-disable @typescript-eslint/no-var-requires */
export async function runCoverage(skipFiles: string[], compileCommand: string, testCommand: string): Promise<void> {
  const { promisify } = require('util');
  const { fork } = require('child_process');
  const exec = promisify(require('child_process').exec);
  const client = require('ganache-cli');
  const path = require('path');
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
    await exec('cp -rf ./contracts/ ./contracts-backup');
    await exec(`cp -rf ./.coverage_contracts/ ./contracts`);

    // compile instrumented contracts
    await exec(compileCommand);

    // run tests
    const fokred = fork(testCommand.split(' ')[0], testCommand.split(' ').slice(1), {
      env: {
        ...process.env,
        cwd: __dirname,
        OZ_TEST_ENV_COVERAGE: 'TRUE',
      },
    });

    const accounts = await new Promise((resolve): unknown => fokred.once('message', resolve));
    api.providerOptions = { accounts: accounts };

    // run Ganache
    const address = await api.ganache();

    // start test-env tests
    fokred.send(address);

    // wait for the tests to finish
    await new Promise((resolve): unknown => fokred.once('close', resolve));

    // write a report
    await api.report();
    // put original source code back
    return Promise.resolve();
  } catch (e) {
    console.log(e);
  } finally {
    utils.finish(config, api);
    await exec('cp -rf ./contracts-backup/ ./contracts');
    await exec('rm -rf ./contracts-backup/');
    await exec('rm -rf ./build/contracts/');
  }
}
