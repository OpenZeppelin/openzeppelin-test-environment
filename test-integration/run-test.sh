#!/bin/bash

set -o errexit

cd $1

# Get a package like a user would install
pkg="$(npm pack ../../ 2> /dev/null | tail -1)"

# Clean it up afterwards
trap "rm -f $pkg" EXIT

npm install

npm install --no-save "$pkg"

npm test
