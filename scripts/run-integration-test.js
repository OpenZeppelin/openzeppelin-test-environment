#!/usr/bin/env node

/* eslint-disable */

const path = require('path');
const { promises: fs } = require('fs');
const { promisify } = require('util');
const { once } = require('events');
const proc = require('child_process');
const execFile = promisify(proc.execFile);
const chalk = require('chalk');

const args = process.argv.slice(2);

if (args[0] === 'run-tarball') {
  run(args.slice(2), args[1]);
} else if (args[0] === 'pack') {
  pack(args[1]);
} else {
  run(args);
}

async function run(tests, package) {
  if (tests.length === 0) {
    tests = await fs.readdir('test-integration');
  } else {
    for (const test of tests) {
      if (!await exists(`test-integration/${test}`)) {
        throw new Error(`Integration test '${test}' does not exist`);
      }
    }
  }

  if (package === undefined) {
    package = await pack(package);
  } else if (!await exists(package)) {
    console.error(chalk.red(`File not found: '${package}'\n`));
    process.exit(1);
  }

  for (const test of tests) {
    console.error(chalk.yellow(`[test:integration running ${test}]`));
    const cwd = `test-integration/${test}`;
    if (!await exists(`${cwd}/node_modules`)) {
      await spawn('npm', ['ci'], { cwd, stdio: 'inherit' });
    }

    await spawn('npm', ['install', '--no-save', path.resolve(package)], { cwd, stdio: 'inherit' });
    await spawn('npm', ['test'], { cwd, stdio: 'inherit' });
  }
}

async function pack(dest) {
  console.error(chalk.yellow(`[test:integration packing tarball]`));
  const { stdout } = await execFile('npm', ['pack']);
  const package = stdout.match(/\n(.+)\n$/)[1];
  if (dest === undefined) {
    return package;
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(package, dest);
    return dest;
  }
}

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}

async function spawn(...args) {
  const child = proc.spawn(...args);
  const [code] = await once(child, 'exit');
  if (code !== 0) {
    throw new Error(`Process exited with an error`);
  }
}
