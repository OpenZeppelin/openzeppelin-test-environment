#!/usr/bin/env node

const { promises: fs } = require('fs');
const { promisify } = require('util');
const proc = require('child_process');
const exec = promisify(proc.exec);

const {
  p: package,
  _: [ command = 'run', ...args ],
} = require('minimist')(process.argv.slice(2));

if (command === 'run') {
  async run(args, { package });
}

async function run(tests, { package }) {
  if (tests.length === 0) {
    tests = await fs.readdir('test-integration');
  }

  if (package === undefined) {
    const { stdout } = await exec('npm', ['run', 'pack']);
    package = stdout.match(/\n(.+)\n$/)[1];
  }

  for (const test of tests) {
    if (!await exists(`test-integration/${test}`)) {

    }
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
