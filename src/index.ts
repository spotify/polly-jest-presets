import { createPollyContext } from './createPollyContext';

// setup Polly instance and save it into global context
const context = createPollyContext(global.pollyConfig || {});
global.pollyContext = context;

// Wait until all network requests are handled by Polly before ending each test.
global.afterEach(async () => {
  await global.pollyContext.polly.flush();
});
