# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.1.7 (2020-11-25)
- Changed the way configuration is passed to Ganache, so as to enable use of config options like `db`.

## 0.1.6 (2020-10-21)
### Fixed
- Fixed error handling in Ganache's child process when the parent process dies.

## 0.1.5 (2020-09-15)
### Added
- Added support for [solidity-coverage](https://github.com/sc-forks/solidity-coverage).
- Bumped ganache-core to 2.11.2.

## 0.1.4 (2020-04-15)
### Added
- Added a `node` option to `test-environment.config` which contains options directly passed to Ganache, including `fork` and `unlocked_accounts` which are handy for tesing on forked chains. `allowUnlimitedContractSize` is supported as well. [See all Ganache options](https://github.com/trufflesuite/ganache-cli).
### Deprecated
- Deprecated the configuration options `blockGasLimit` and `gasPrice`. Users should instead use the options `node.gasLimit` and `node.gasPrice`.

## 0.1.3 (2020-02-18)
### Fixed
 * Add missing dependency for exported types.

## 0.1.2 (2020-01-20)
### Added
 * Added `artifactsDir` and `defaultGasPrice` options. ([943d74](https://github.com/OpenZeppelin/openzeppelin-test-environment/commit/943d74))

## 0.1.1 (2019-11-28)
### Added
 * Initial release
