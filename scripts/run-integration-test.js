#!/usr/bin/env node

const path = require('path');
const { promises: fs } = require('fs');
const { promisify } = require('util');
const { once } = require('events');
const proc = require('child_process');
const execFile = promisify(proc.execFile);

const [,, command = 'run', ...args] = process.argv;

if (command === 'run') {
  run(args);
} else if (command === 'run-tarball') {
  run(args.slice(1), args[0]);
} else if (command === 'pack') {
  pack(package);
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

  if (package === undefined || !await exists(package)) {
    package = await pack(package);
  }

  for (const test of tests) {
    const cwd = `test-integration/${test}`;
    if (!await exists(`${cwd}/node_modules`)) {
      await spawn('npm', ['ci'], { cwd, stdio: 'inherit' });
    }

    await spawn('npm', ['install', '--no-save', path.resolve(package)], { cwd, stdio: 'inherit' });
    await spawn('npm', ['test'], { cwd, stdio: 'inherit' });
  }
}

async function pack(dest) {
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
    console.error(args);
    throw new Error(`Process exited with an error`);
  }
}
