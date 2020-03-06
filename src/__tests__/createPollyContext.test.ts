import { setupPolly } from 'setup-polly-jest';

import {createPollyContext, defaultConfig} from "../createPollyContext"

jest.mock("setup-polly-jest")


describe('test create polly context', () => {
  it('creates polly context', () => {
    createPollyContext({})
    expect(setupPolly).toHaveBeenCalledWith(defaultConfig)

  });

});
