import { queryBase } from './query';

describe('resolvers helpers', () => {
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
        db: '',
        ...formInput,
        q: 'SELECT * FROM test',
        responseType: 'csv',
      });
      expect(cacheMock.readQuery).toBeCalledTimes(1);
      expect((cacheMock as any).readQuery.mock.calls[0][0].query).toEqual({
        definitions: expect.any(Array),
        kind: 'Document',
        loc: expect.any(Object),
      });
    });
  });
});
