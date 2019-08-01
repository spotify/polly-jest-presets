import { setupPolly } from 'setup-polly-jest';
import { Polly } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FSPersister from '@pollyjs/persister-fs';
import merge from 'lodash.merge';

import { DEFAULT_RECORDING_DIR, DEFAULT_EXPIRATION_DAYS } from './constants';

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
      recordingsDir: DEFAULT_RECORDING_DIR,
    },
  },
  mode,
  recordIfMissing: false,
  recordFailedRequests: true,
  expiryStrategy: process.env.CI ? 'error' : 'record',
  expiresIn: `${DEFAULT_EXPIRATION_DAYS}d`,
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

// setup Polly instance and save it into global context
const context = setupPolly(merge({}, defaultConfig, global.pollyConfig));
global.pollyContext = context;

// Wait until all network requests are handled by Polly before ending each test.
global.afterEach(async () => {
  await global.pollyContext.polly.flush();
});
