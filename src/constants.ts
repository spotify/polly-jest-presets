import path from 'path';

export const DEFAULT_EXPIRATION_DAYS = 14;
export const DEFAULT_DAYS_FOR_EXPIRY_WARNING = 3;
export const DEFAULT_RECORDING_DIR_NAME = '.polly_recordings';
export const DEFAULT_RECORDING_DIR = path.resolve(
  path.join(
    process.cwd(),
    DEFAULT_RECORDING_DIR_NAME,
  )
);

export const COLORS = {
  RED: '\x1B[91m',
  YELLOW: '\x1B[93m',
  DEFAULT: '\x1B[39m',
}
