import { getConnections, updateConnections } from './connections';
import storage from './storage';
jest.mock('./storage');

const connections = [
  {
    id: 'test',
    url: 'http://test.test',
    u: 'user',
  },
  {
    id: 'test2',
    url: 'http://test2.test',
    db: 'mydb',
  },
];
const cacheMock = {
  writeData: jest.fn(),
  readQuery: jest.fn(() => ({
    connections,
  })),
};

describe('connections helpers', () => {
  test('getConnections()', () => {
    expect(getConnections(cacheMock)).toEqual(connections);
    expect(getConnections({ readQuery: () => '' })).toEqual([]);
  });
  test('updateConnections() no error', () => {
    const newConnections = [
      {
        id: 'other',
        url: 'http://other.test',
      },
    ];

    updateConnections(cacheMock, newConnections);

    expect(storage.set).toBeCalledWith(
      'connections',
      JSON.stringify(newConnections),
    );
    expect(cacheMock.writeData).toBeCalledWith({
      data: { connections: newConnections },
    });
  });
});
