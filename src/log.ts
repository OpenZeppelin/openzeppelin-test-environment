import colors from 'ansi-colors';

export function log(msg: string): void {
  console.log(`${colors.white.bgBlack('@openzeppelin/test-env')} ${msg}`);
}

export function warn(msg: string): void {
  log(`${colors.black.bgYellow('WARN')} ${msg}`);
}
