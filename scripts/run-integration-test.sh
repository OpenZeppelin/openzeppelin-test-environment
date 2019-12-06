#!/usr/bin/env bash

set -o errexit -o pipefail

# We install via tarball to simulate install from registry
pkg="$(realpath $(npm pack 2> /dev/null | tail -1))"

# Clean it up afterwards
trap "rm -f $pkg" EXIT

for dir in test-integration/${1:-*}
do
  cd "$dir"

  # Install dependencies if necessary
  if [ ! -d node_modules ]; then
    npm ci
  fi

  npm install --no-save "$pkg"

  npm test
done
