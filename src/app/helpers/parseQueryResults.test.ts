import { parseQueryResults } from './parseQueryResults';

describe('parseQueryResults()', () => {
  test('standard and qouted tag values', async () => {
    // given
    const data = `name,tags,key
,,"weather,location=eu"
,,"weather,location=us"
test,,"weather,location=us-midwest"
,123,"weather,location123=eu"
test123,,asd="""as-d"""`;

    // when
    const parsed = parseQueryResults(data);

    // then
    expect(parsed).toStrictEqual([
      { key: 'weather,location=eu', name: '', tags: '' },
      { key: 'weather,location=us', name: '', tags: '' },
      { key: 'weather,location=us-midwest', name: 'test', tags: '' },
      { key: 'weather,location123=eu', name: '', tags: '123' },
      { key: 'asd="as-d"', name: 'test123', tags: '' },
    ]);
  });

  test('dotted tags', async () => {
    // given
    const data = `name,tags,time,"""my.tag""","""other.tag"""
test123,,1465839830100400200,123,asdf.xcv`;

    // when
    const parsed = parseQueryResults(data);

    // then
    expect(parsed).toStrictEqual([
      {
        name: 'test123',
        'my.tag': '123',
        'other.tag': 'asdf.xcv',
        tags: '',
        time: '1465839830100400200',
      },
    ]);
  });

  test('no data', async () => {
    // when
    const parsed = parseQueryResults('');

    // then
    expect(parsed).toBe(undefined);
  });

  test('invalid data', async () => {
    expect(parseQueryResults('???123')).toEqual([]);
  });
});
