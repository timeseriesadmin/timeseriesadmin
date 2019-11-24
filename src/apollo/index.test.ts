import client from './index';

describe('defaults', () => {
  test('initial values', () => {
    expect(client).not.toBe(undefined);
  });
});
