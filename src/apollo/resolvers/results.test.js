import { setResultsTable } from './results';
import storage from '../../helpers/storage';
jest.mock('../../helpers/storage');

describe('results resolvers', () => {
  test('setResultsTable() next page', () => {
    const setMock = jest.fn();
    const cacheMock = {
      readQuery: jest.fn(() => ({
        resultsTable: {
          order: 'asc',
          orderKey: 'name',
          page: 1,
          rowsPerPage: 10,
          timeFormat: 'ms',
        },
      })),
      writeData: jest.fn(),
    };
    storage.set.mockImplementation(setMock);
    expect(
      setResultsTable(
        null,
        { page: 2, order: undefined },
        { cache: cacheMock },
      ),
    ).toBe(null);
    expect(cacheMock.readQuery).toBeCalledTimes(1);
    expect(setMock).toBeCalledWith('timeFormat', 'ms');

    expect(cacheMock.writeData).toBeCalledTimes(1);
    expect(cacheMock.writeData).toBeCalledWith({
      data: {
        resultsTable: {
          __typename: 'ResultsTable',
          order: 'asc',
          orderKey: 'name',
          page: 2,
          rowsPerPage: 10,
          timeFormat: 'ms',
        },
      },
    });
  });
});
