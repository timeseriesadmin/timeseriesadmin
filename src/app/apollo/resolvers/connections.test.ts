import { saveConnection, deleteConnection } from './connections';
import { getConnections, updateConnections } from '../../helpers/connections';
jest.mock('../../helpers/connections');

describe('connections resolvers', () => {
  test('saveConnection() new', () => {
    (getConnections as any).mockImplementation(() => []);
    expect(
      saveConnection(
        undefined,
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
    (getConnections as any).mockImplementation(() => [
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
        undefined,
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
    (getConnections as any).mockImplementation(() => [
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
      deleteConnection(
        undefined,
        { id: 'http://test.testuser_' },
        { cache: null },
      ),
    ).toBe(null);
    expect(updateConnections).toBeCalledWith(null, []);
  });
});
