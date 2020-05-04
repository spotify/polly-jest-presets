import { Polly } from '@pollyjs/core';
import { pollyContext } from '../';

describe('test node preset', () => {
  it('creates a global polly context', () => {
    expect(pollyContext.polly).toBeInstanceOf(Polly);
  });

  it('configures the polly instance', () => {
    expect(pollyContext.polly.config).toMatchInlineSnapshot(`
      Object {
        "adapterOptions": Object {},
        "adapters": Array [
          "node-http",
        ],
        "expiresIn": "14d",
        "expiryStrategy": "warn",
        "logging": false,
        "matchRequestsBy": Object {
          "body": false,
          "headers": false,
          "method": true,
          "order": true,
          "url": Object {
            "hash": false,
            "hostname": true,
            "password": true,
            "pathname": true,
            "port": true,
            "protocol": true,
            "query": true,
            "username": true,
          },
        },
        "mode": "replay",
        "persister": "fs",
        "persisterOptions": Object {
          "disableSortingHarEntries": false,
          "fs": Object {
            "recordingsDir": "src/__tests__/__recordings__",
          },
          "keepUnusedRequests": false,
        },
        "recordFailedRequests": true,
        "recordIfMissing": false,
        "timing": [Function],
      }
    `);
  });
});
