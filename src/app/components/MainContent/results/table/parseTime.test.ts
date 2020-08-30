import { parseTime } from './parseTime';

const realGetTimezoneOffset = global.Date.prototype.getTimezoneOffset;

describe('parseTime()', () => {
  beforeAll(() => {
    global.Date.prototype.getTimezoneOffset = (): number => 0;
  });
  afterAll(() => {
    global.Date.prototype.getTimezoneOffset = realGetTimezoneOffset;
  });
  test('regular params', () => {
    expect(parseTime('1598808980000000000', 's')).toBe('2020-08-30 17:36:20');
    expect(parseTime('1598808980000000000', 'ms')).toBe(
      '2020-08-30 17:36:20.000',
    );
    expect(parseTime('1598808980000000000', 'ns')).toBe(
      '2020-08-30 17:36:20.000000000',
    );
    expect(parseTime('1598808980000000000', '')).toBe('1598808980000');
    expect(parseTime('1598808980000000000', 'timestamp')).toBe('1598808980000');
  });
  test('time = 0 case', () => {
    expect(parseTime('0', 's')).toBe('1970-01-01 00:00:00');
    expect(parseTime('0', 'ms')).toBe('1970-01-01 00:00:00.000');
    expect(parseTime('0', 'ns')).toBe('1970-01-01 00:00:00.000000000');
    expect(parseTime('0', '')).toBe('0');
    expect(parseTime('0', 'timestamp')).toBe('0');
  });
  test('time = "" case', () => {
    expect(parseTime('', 's')).toBe('1970-01-01 00:00:00');
    expect(parseTime('', 'ms')).toBe('1970-01-01 00:00:00.000');
    expect(parseTime('', 'ns')).toBe('1970-01-01 00:00:00.000000000');
    expect(parseTime('', '')).toBe('0');
    expect(parseTime('', 'timestamp')).toBe('0');
  });
  test('negative time case', () => {
    expect(parseTime('-1000000000000', 's')).toBe('1969-12-31 23:43:20');
    expect(parseTime('-1000000000', 'ms')).toBe('1969-12-31 23:59:59.000');
    // TODO: negative ns are not handled well
    expect(parseTime('-1000', 'ns')).toBe('1970-01-01 00:00:00.0000-1000');
    expect(parseTime('-1000000000', '')).toBe('-1000');
    expect(parseTime('-2000000000', 'timestamp')).toBe('-2000');
  });
});
