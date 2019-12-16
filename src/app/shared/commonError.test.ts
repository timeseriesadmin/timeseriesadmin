import { commonError } from './commonError';

describe('commonError()', () => {
  test('already common', () => {
    // given
    const error = { isCommon: true };
    // when/then
    expect(commonError(error)).toStrictEqual(error);
  });

  test('request error', () => {
    // given
    const error = { response: { status: 401, statusText: 'Unauthorized' } };
    // when/then
    expect(commonError(error)).toStrictEqual({
      title: '401: Unauthorized',
      details: error,
      isCommon: true,
    });
  });

  test('native error', () => {
    // given
    const error = { code: 123, message: 'Native error', stack: 'Stack trace' };
    // when/then
    expect(commonError(error)).toStrictEqual({
      title: '123: Native error',
      details: 'Stack trace',
      isCommon: true,
    });
  });

  test('network error', () => {
    // given
    const error = { message: 'Network error' };
    // when/then
    expect(commonError(error)).toStrictEqual({
      title: 'Network error',
      details: error,
      isCommon: true,
    });
  });

  test('axios error', () => {
    // given
    const error = { isAxiosError: true, code: '123', other: 'test' };
    // when/then
    expect(commonError(error)).toStrictEqual({
      title: '123',
      details: error,
      isCommon: true,
    });
  });

  test('unknown error', () => {
    // given
    const error = { someOther: 'error' };
    // when/then
    expect(commonError(error)).toStrictEqual({
      title: 'Unknown unexpected error',
      details: error,
      isCommon: true,
    });
  });
});
