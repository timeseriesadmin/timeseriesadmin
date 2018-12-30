import { saveQueryHistory } from './history';

const queryHistory = () => [
  {
    query: 'SHOW DATABASES',
    error: null,
    __typename: 'InfluxQuery',
  },
  {
    query: 'SELECT f1 FROM test123',
    error: 'Some error message',
    __typename: 'InfluxQuery',
  },
];
const cacheMock = {
  writeData: jest.fn(),
  readQuery: jest.fn(() => ({
    queryHistory: queryHistory(),
  })),
};

describe('query history helpers', () => {
  test('saveQueryHistory()', () => {
    cacheMock.writeData.mockClear();
    cacheMock.readQuery.mockClear();

    const res = saveQueryHistory('SELECT * FROM test', cacheMock, {
      message: 'some message',
    });

    expect(cacheMock.readQuery).toBeCalledTimes(1);

    expect(cacheMock.writeData).toBeCalledTimes(1);
    expect(cacheMock.writeData).toBeCalledWith({
      data: {
        queryHistory: [
          {
            __typename: 'InfluxQuery',
            error: '{"message":"some message"}',
            query: 'SELECT * FROM test',
          },
          ...queryHistory(),
        ],
      },
    });
    expect(res).toEqual(cacheMock.writeData.mock.calls[0][0].data.queryHistory);
  });

  test('saveQueryHistory() with existing query at index 0', () => {
    cacheMock.writeData.mockClear();
    cacheMock.readQuery.mockClear();

    const res = saveQueryHistory('SHOW DATABASES', cacheMock, [
      { message: 'some message' },
    ]);

    expect(cacheMock.readQuery).toBeCalledTimes(1);
    expect(res).toBe(false);
  });

  test('saveQueryHistory() with existing query at index != 0', () => {
    cacheMock.writeData.mockClear();
    cacheMock.readQuery.mockClear();

    const res = saveQueryHistory('SELECT f1 FROM test123', cacheMock, {
      message: 'some message',
    });

    const newHistory = [
      {
        query: 'SELECT f1 FROM test123',
        error: '{"message":"some message"}',
        __typename: 'InfluxQuery',
      },
      {
        query: 'SHOW DATABASES',
        error: null,
        __typename: 'InfluxQuery',
      },
    ];
    expect(cacheMock.writeData).toBeCalledWith({
      data: {
        queryHistory: newHistory,
      },
    });
    expect(res).toEqual(newHistory);
  });
});
