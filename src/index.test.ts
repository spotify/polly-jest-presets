import { Polly } from '@pollyjs/core';
import { DEFAULT_EXPIRATION } from './constants';
import '.';

describe('test node preset', () => {
  it('creates a global polly context', () => {
    expect(global.pollyContext.polly).toBeInstanceOf(Polly);
  });

  it('configures the polly instance', () => {
    expect(global.pollyContext.polly.config.expiresIn).toEqual(DEFAULT_EXPIRATION);
  });
});
