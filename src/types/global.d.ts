declare module NodeJS {
  interface Global {
    beforeEach: Function,
    afterEach: Function,
    pollyContext: {
      polly: import('@pollyjs/core').Polly & { config: import('@pollyjs/core').PollyConfig },
    },
    pollyConfig?: import('@pollyjs/core').PollyConfig,
  }
}
