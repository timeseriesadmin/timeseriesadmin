import { saveConnection, deleteConnection } from './connections';
import { getConnections, updateConnections } from '../helpers/connections';
jest.mock('../helpers/connections');

describe('connections resolvers', () => {
  test('saveConnection() new', () => {
    getConnections.mockImplementation(() => []);
    expect(
      saveConnection(
        null,
        { url: 'http://test.test', u: 'user' },
        { cache: null },
      ),
    ).toBe(null);
    expect(updateConnections).toBeCalledWith(null, [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.testuser_',
        p: undefined,
        u: 'user',
        url: 'http://test.test',
      },
    ]);
  });

  test('saveConnection() update', () => {
    getConnections.mockImplementation(() => [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.testuser_',
        p: undefined,
        u: 'user',
        url: 'http://test.test',
      },
    ]);
    expect(
      saveConnection(
        null,
        { url: 'http://test.test', u: 'user', p: 'password' },
        { cache: null },
      ),
    ).toBe(null);
    expect(updateConnections).toBeCalledWith(null, [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.testuser_',
        p: 'password',
        u: 'user',
        url: 'http://test.test',
      },
    ]);
  });

  test('deleteConnection()', () => {
    getConnections.mockImplementation(() => [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.testuser_',
        p: undefined,
        u: 'user',
        url: 'http://test.test',
      },
    ]);
    expect(
      deleteConnection(null, { id: 'http://test.testuser_' }, { cache: null }),
    ).toBe(null);
    expect(updateConnections).toBeCalledWith(null, []);
  });
});
