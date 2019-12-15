import storage from './storage';

describe('storage', () => {
  test('get() default value', () => {
    const res = storage.get('test', 123);
    expect(res).toBe(123);
  });
  test('set() and get()', () => {
    storage.set('test', '456');
    expect(storage.get('test')).toBe('456');
  });
});
