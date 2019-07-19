import path from 'path';

export const DEFAULT_EXPIRATION = '14d';
export const DEFAULT_RECORDING_DIR_NAME = '.polly_recordings';
export const DEFAULT_RECORDING_DIR = path.resolve(
  path.join(
    process.cwd(),
    DEFAULT_RECORDING_DIR_NAME,
  )
);
