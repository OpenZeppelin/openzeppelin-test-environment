#!/usr/bin/env node

const { runCoverage } = require('@openzeppelin/test-environment');

runCoverage([], 'npm run compile', './node_modules/.bin/mocha --exit --timeout 10000 --recursive');
