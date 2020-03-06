import {PollyConfig} from "@pollyjs/core"
import { createPollyContext } from './createPollyContext';

export function configure(config:PollyConfig) {
  const context = createPollyContext(config)
  if (!global.pollyContext)
  global.pollyContext = context;

// Wait until all network requests are handled by Polly before ending each test.
  global.afterEach(async () => {
    await global.pollyContext.polly.flush();
  });
}
