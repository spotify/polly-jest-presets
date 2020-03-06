import { Polly } from '@pollyjs/core';
import {createPollyContext} from "../createPollyContext"
import {configure} from '../cra';

jest.mock("../createPollyContext")

const createPollyContextMock = createPollyContext as typeof createPollyContext & {
  mockReturnValueOnce(returnValue: object): void
}

describe('test configure for cra', () => {
  it('creates polly context', () => {
    createPollyContextMock.mockReturnValueOnce({polly: new Polly("FooBar")})
    configure({})
    expect(global.pollyContext.polly).toBeInstanceOf(Polly);
  });

});
