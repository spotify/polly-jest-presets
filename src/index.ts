import path from 'path';
import { setupPolly } from 'setup-polly-jest';
import { Polly } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FSPersister from '@pollyjs/persister-fs';
import merge from 'lodash.merge';

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const mode = process.env.POLLY_MODE || 'replay';

// setup default config for Polly
const defaultConfig = {
  adapters: ['node-http'],
  persister: 'fs',
  persisterOptions: {
    keepUnusedRequests: false,
    fs: {
      recordingsDir: getDefaultRecordingDir(),
    },
  },
  mode,
  recordIfMissing: false,
  recordFailedRequests: true,
  expiryStrategy: 'warn',
  expiresIn: '14d',
  // insulate the tests from differences in session data. we use order and
  // url to match requests to one another, which we did previously with an
  // internal fork of LinkedIn's Sepia VCR. This should be fine for deterministic
  // requests, and you can circumvent non-deterministic stuff by manipulating
  // things in the Polly Server: https://netflix.github.io/pollyjs/#/server/overview?id=overview
  matchRequestsBy: {
    headers: false,
    body: false,
  },
};

type PollyContext = {
  polly: import('@pollyjs/core').Polly & {
    config: import('@pollyjs/core').PollyConfig;
  };
};

export const pollyContext: PollyContext = setupPolly(
  merge({}, defaultConfig, (global as any).pollyConfig),
);

afterEach(() => pollyContext.polly.flush());

function getDefaultRecordingDir() {
  const testPath: string = (global as any).jasmine.testPath;
  return path.relative(
    process.cwd(),
    `${path.dirname(testPath)}/__recordings__`,
  );
}
