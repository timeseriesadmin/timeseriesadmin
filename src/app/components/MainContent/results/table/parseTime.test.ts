import { parseTime } from './parseTime';

describe('parseTime()', () => {
  test('regular params', () => {
    expect(parseTime('1598808980000000000', 's')).toBe('2020-08-30T17:36:20Z');
    expect(parseTime('1598808980000000000', 'ms')).toBe(
      '2020-08-30T17:36:20.000Z',
    );
    expect(parseTime('1598808980000000000', 'ns')).toBe(
      '2020-08-30T17:36:20.000000000Z',
    );
    expect(parseTime('1598808980000000000', '')).toBe('1598808980000000000');
    expect(parseTime('1598808980000000000', 'timestamp')).toBe(
      '1598808980000000000',
    );
  });
  test('time = 0 case', () => {
    expect(parseTime('0', 's')).toBe('1970-01-01T00:00:00Z');
    expect(parseTime('0', 'ms')).toBe('1970-01-01T00:00:00.000Z');
    expect(parseTime('0', 'ns')).toBe('1970-01-01T00:00:00.000000000Z');
    expect(parseTime('0', '')).toBe('0');
    expect(parseTime('0', 'timestamp')).toBe('0');
  });
  test('time = "" case', () => {
    expect(parseTime('', 's')).toBe('1970-01-01T00:00:00Z');
    expect(parseTime('', 'ms')).toBe('1970-01-01T00:00:00.000Z');
    expect(parseTime('', 'ns')).toBe('1970-01-01T00:00:00.000000000Z');
    expect(parseTime('', '')).toBe('0');
    expect(parseTime('', 'timestamp')).toBe('0');
  });
  test('negative time case', () => {
    expect(parseTime('-1000000000000', 's')).toBe('1969-12-31T23:43:20Z');
    expect(parseTime('-1000000000', 'ms')).toBe('1969-12-31T23:59:59.000Z');
    // TODO: negative ns are not handled well
    expect(parseTime('-1000', 'ns')).toBe('1970-01-01T00:00:00.0000-1000Z');
    expect(parseTime('-1000000000', '')).toBe('-1000000000');
    expect(parseTime('-2000000000', 'timestamp')).toBe('-2000000000');
  });
});
