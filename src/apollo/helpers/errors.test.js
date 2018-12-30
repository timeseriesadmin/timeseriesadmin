import { handleQueryError } from './errors';

describe('errors helpers', () => {
  test('handleQueryError() no error', () => {
    expect(handleQueryError(undefined)).toBe(undefined);
    expect(handleQueryError(null)).toBe(undefined);
    expect(handleQueryError('')).toBe(undefined);
  });

  test('handleQueryError()', () => {
    expect(() =>
      handleQueryError({
        response: {
          status: 400,
          statusText: 'Bad request',
          data: 'error,message\n400,bad request',
        },
      }),
    ).toThrow('400:Bad request');
  });

  test('handleQueryError() invalid data', () => {
    expect(() =>
      handleQueryError({
        response: {
          status: 400,
          statusText: 'Bad request',
          data: '',
        },
      }),
    ).toThrow('400:Bad request');
  });
});
