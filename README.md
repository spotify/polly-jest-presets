# polly-jest-presets

[![Actions Status](https://github.com/spotify/polly-jest-presets/workflows/Tests/badge.svg)](https://github.com/spotify/polly-jest-presets/actions)
[![Version](https://img.shields.io/npm/v/@spotify/polly-jest-presets.svg)](https://www.npmjs.com/package/@spotify/polly-jest-presets)

An opinionated configuration and wrapper around [Polly] and [setup-polly-jest] to have automatic recording and playback of network requests made during your [Jest] tests.

**Note:** Polly Jest Presets bundles in all necessary Polly packages to make the setup as easy as possible for a typical Node-based web app. It uses File persister to store recordings locally. Therefore, there's no need to install Polly or Polly Jest bindings separately in your project after including this preset.

**Packages included:**

```json
"@pollyjs/adapter-node-http": "^2.6.0",
"@pollyjs/core": "^2.6.0",
"@pollyjs/persister-fs": "^2.6.0",
"setup-polly-jest": "^0.5.2",
```

## Usage

Install the preset as a dev dependency:

```sh
yarn add @spotify/polly-jest-presets -D
```

Add the preset to your [Jest config](https://jestjs.io/docs/en/configuration) (by default `jest.config.js`), in the `setupFilesAfterEnv`:

```json
{
  "setupFilesAfterEnv": ["@spotify/polly-jest-presets"]
}
```

Or import in an individual test.

```js
// ./my.test.js
import '@spotify/polly-jest-presets';
```

### Getting Started

To test it out, make a network request in one of your tests.

```js
import '@spotify/polly-jest-presets';
// `yarn add -D node-fetch` for this demo
import fetch from 'node-fetch';

describe('a dummy test', () => {
  it('fetches something', async () => {
    const resp = await fetch('https://reqres.in/api/users?page=2');
    const payload = await resp.json();
    expect(payload.data.length).toBeGreaterThan(1);
  });
});
```

First, you need to run the tests with the `POLLY_MODE` environment variable set to `record`. This will tell Polly that you intend for all of the requests to record in this test run.

```sh
POLLY_MODE="record" jest
```

You should now see a `__recordings__` directory next to your test file. It should contain a `.har` file which shows the request we made within the it block.

To test that playback works, disconnect your internet on your machine and run:

```sh
POLLY_MODE="replay" jest
```

The test still passes! _Note: the default POLLY_MODE is `replay`._

### Configuration and API usage

If you want to override Polly configuration, you can add configuration to `globals.pollyConfig` in the Jest config:

```json
{
  "globals": {
    "pollyConfig": {
      "expiresIn": "3 months"
    }
  }
}
```

_See all of the valid Polly options [in the Polly documentation](https://netflix.github.io/pollyjs/#/configuration)._

You may also want to get at the global Polly instance. You can import it:

```js
// if you need access to the pollyContext
import { pollyContext } from '@spotify/polly-jest-presets';

pollyContext.polly.server
  .get('/series')
  .intercept((req, res) => res.sendStatus(200));
```

_See all of the Polly API methods [in the Polly documentation](https://netflix.github.io/pollyjs/#/api)._

## Opinions

This preset has a few opinions baked in. All of these are overridable by setting the `globals.pollyConfig` in your Jest config.

### Expire recordings often

We think it's safer to expire recordings frequently. The default `expiresIn` is set to `"14d"` in this preset. By default, `expiryStrategy` is configured to `warn`.

### Explicit recording only (no `recordIf*`)

We think it makes more sense to avoid recording in the background for test authoring to avoid unexpected changes to checked in .har files. Because of this, we have set all of the `recordIf*` config values to false. **This means that your tests will fail when you first write them if you don't override `POLLY_MODE`.**

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

[polly]: https://netflix.github.io/pollyjs
[setup-polly-jest]: https://www.npmjs.com/package/setup-polly-jest
[eslint]: https://eslint.org/
[jest]: http://jestjs.io/
