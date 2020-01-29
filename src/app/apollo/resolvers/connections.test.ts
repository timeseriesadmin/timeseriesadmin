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
    expect(updateConnections).toHaveBeenLastCalledWith(null, [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.testuser_',
        p: undefined,
        u: 'user',
        url: 'http://test.test',
        unsafeSsl: undefined,
      },
    ]);
  });

  test('saveConnection() update using defaults', () => {
    (getConnections as any).mockImplementation(() => [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.test__',
        p: undefined,
        u: undefined,
        url: 'http://test.test',
        unsafeSsl: undefined,
      },
    ]);
    expect(
      saveConnection(
        undefined,
        {
          url: 'http://test.test',
          u: undefined,
          p: 'password',
          unsafeSsl: undefined,
        },
        { cache: null },
      ),
    ).toBe(null);
    expect(updateConnections).toHaveBeenLastCalledWith(null, [
      {
        __typename: 'Connection',
        db: undefined,
        id: 'http://test.test__',
        p: 'password',
        u: undefined,
        url: 'http://test.test',
        unsafeSsl: undefined,
      },
    ]);
  });

  test('saveConnection() update', () => {
    (getConnections as any).mockImplementation(() => [
      {
        __typename: 'Connection',
        db: 'db',
        id: 'http://test.testuserdb',
        p: undefined,
        u: 'user',
        url: 'http://test.test',
        unsafeSsl: true,
      },
    ]);
    expect(
      saveConnection(
        undefined,
        {
          db: 'db',
          url: 'http://test.test',
          u: 'user',
          p: 'password',
          unsafeSsl: true,
        },
        { cache: null },
      ),
    ).toBe(null);
    expect(updateConnections).toHaveBeenLastCalledWith(null, [
      {
        __typename: 'Connection',
        db: 'db',
        id: 'http://test.testuserdb',
        p: 'password',
        u: 'user',
        url: 'http://test.test',
        unsafeSsl: true,
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
    expect(updateConnections).toHaveBeenLastCalledWith(null, []);
  });
});
