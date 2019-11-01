#!/bin/bash

./test/dep.sh ./test/mocha-config
./test/dep.sh ./test/mocha-defaults
./test/dep.sh ./test/jest
./test/dep.sh ./test/ava
