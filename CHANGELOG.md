# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## 0.2.0 (2020-04-6)
### Added
- Added a `node` option to `test-environment.config` which contains options directly passed to Ganache, including `fork` and `unlocked_accounts` which are handy for tesing on forked chains. `allowUnlimitedContractSize` is supported as well. [See all Ganache options](https://github.com/trufflesuite/ganache-cli).

## 0.1.3 (2020-02-18)
### Fixed
 * Add missing dependency for exported types.

## 0.1.2 (2020-01-20)
### Added
 * Added `artifactsDir` and `defaultGasPrice` options. ([943d74](https://github.com/OpenZeppelin/openzeppelin-test-environment/commit/943d74))

## 0.1.1 (2019-11-28)
### Added
 * Initial release
