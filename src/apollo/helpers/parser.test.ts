import { parseResults } from './parser';

describe('parseResults()', () => {
  test('databases', () => {
    const databases = parseResults(
      'name,tags,name\ndatabases,db_tag1,test\ndatabases,,_internal',
      { id: 'name', name: 'name', tags: 'tags' },
      'SomeType',
    );
    expect(databases).toEqual([
      { id: 'test', name: 'test', tags: 'db_tag1', __typename: 'SomeType' },
      {
        id: '_internal',
        name: '_internal',
        tags: '',
        __typename: 'SomeType',
      },
    ]);
  });
  test('empty results', () => {
    const databases = parseResults('\n ', {
      id: 'name',
      name: 'name',
      tags: 'tags',
    });
    expect(databases).toEqual(null);
  });
  test('invalid csv', () => {
    expect(() =>
      parseResults('name,tags,name\ndatabases,test\ndatabases,,_internal', {
        id: 'name',
        name: 'name',
        tags: 'tags',
      }),
    ).toThrow(
      '[{"type":"FieldMismatch","code":"TooFewFields","message":"Too few fields: expected 3 fields but parsed 2","row":0}]',
    );
  });
});
