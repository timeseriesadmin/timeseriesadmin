import {
  isRequired,
  isPositiveInt,
  inRange,
  hasLength,
  composeValidators,
} from './validators';

describe('validators', () => {
  test('isRequired()', () => {
    expect(isRequired(5)).toBe(undefined);
    expect(isRequired()).toBe('Value is required');
    expect(isRequired('')).toBe('Value is required');
    expect(isRequired(null)).toBe('Value is required');
    expect(isRequired(undefined)).toBe('Value is required');
  });
  test('isPositiveInt()', () => {
    expect(isPositiveInt(5)).toBe(undefined);
    expect(isPositiveInt('51')).toBe(undefined);
    expect(isPositiveInt()).toBe('Value has to be a positive integer');
    expect(isPositiveInt(0)).toBe('Value has to be a positive integer');
    expect(isPositiveInt(-1)).toBe('Value has to be a positive integer');
    expect(isPositiveInt(1123.1231)).toBe('Value has to be a positive integer');
    expect(isPositiveInt('11.12')).toBe('Value has to be a positive integer');
    expect(isPositiveInt('')).toBe('Value has to be a positive integer');
    expect(isPositiveInt(null)).toBe('Value has to be a positive integer');
    expect(isPositiveInt(undefined)).toBe('Value has to be a positive integer');
  });
  test('inRange()', () => {
    const myRange = inRange(-1, 100);
    expect(myRange(5)).toBe(undefined);
    expect(myRange('81.2')).toBe(undefined);
    expect(myRange('-0.9')).toBe(undefined);
    expect(myRange(0)).toBe(undefined);
    expect(myRange(null)).toBe(undefined);
    expect(myRange()).toBe(undefined);
    expect(myRange(101)).toMatch(/Value has to be smaller than/);
    expect(myRange('101.213')).toMatch(/Value has to be smaller than/);
    expect(myRange(-10)).toMatch(/Value has to be larger than/);
    expect(myRange('-10.1')).toMatch(/Value has to be larger than/);
  });
  test('hasLength()', () => {
    const myLength = hasLength(3, 5);
    expect(myLength(123456)).toBe(undefined);
    expect(myLength('81.2')).toBe(undefined);
    expect(myLength('123')).toBe(undefined);
    expect(myLength([1, 2, 3, 4])).toBe(undefined);
    expect(myLength(null)).toBe(undefined);
    expect(myLength()).toBe(undefined);
    expect(myLength('123456')).toMatch(/Maximum length is/);
    expect(myLength('-101.213')).toMatch(/Maximum length is/);
    expect(myLength([1, 2, 3, 4, 5, 6])).toMatch(/Maximum length is/);
    expect(myLength('12')).toMatch(/Minimum length is/);
  });
  test('composeValidators()', () => {
    const composed = composeValidators(isRequired, inRange(1, 5));
    expect(composed(3)).toBe(undefined);
    expect(composed()).toBe('Value is required');
    expect(composed(0.9)).toMatch(/Value has to be larger than/);
    expect(composed(10.1)).toMatch(/Value has to be smaller than/);
  });
});
