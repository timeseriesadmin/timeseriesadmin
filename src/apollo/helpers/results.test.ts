import { resetResultsTable } from './results';

const cacheMock = {
  writeData: jest.fn(),
  readQuery: jest.fn(() => ({
    resultsTable: {
      timeFormat: 'timestamp',
      rowsPerPage: 20,
      page: 123,
      orderKey: 'name',
      order: 'asc',
    },
  })),
};

describe('results helpers', () => {
  test('resetResultsTable()', () => {
    resetResultsTable(cacheMock);

    expect(cacheMock.readQuery).toBeCalledTimes(1);

    expect(cacheMock.writeData).toBeCalledTimes(1);
    expect(cacheMock.writeData).toBeCalledWith({
      data: {
        resultsTable: {
          timeFormat: 'timestamp',
          rowsPerPage: 20,
          page: 0,
          orderKey: '',
          order: 'desc',
        },
      },
    });
  });
});
