import { parseResults, queryBase } from './helpers';

describe('resolvers helpers', () => {
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
  describe('queryBase()', () => {
    test('standard GQL query', () => {
      const formInput = {
        url: 'http://test.test:8086',
        u: 'username',
        p: 'password',
      };
      const cacheMock = {
        readQuery: jest.fn(() => ({
          form: formInput,
        })),
      };
      const query = queryBase(cacheMock, 'SELECT * FROM test');
      expect(query).toEqual({
        ...formInput,
        q: 'SELECT * FROM test',
        responseType: 'csv',
      });
      expect(cacheMock.readQuery).toBeCalledTimes(1);
      expect(cacheMock.readQuery.mock.calls[0][0].query).toEqual({
        definitions: expect.any(Array),
        kind: 'Document',
        loc: expect.any(Object),
      });
    });
  });
});
