import { setResultsTable } from './results';
import storage from '../../helpers/storage';
jest.mock('../../helpers/storage');

describe('results resolvers', () => {
  test('setResultsTable() next page', () => {
    const setMock = jest.fn();
    const cacheMock = {
      readQuery: jest.fn(() => ({
        resultsTable: {
          timeFormat: 'ms',
        },
      })),
      writeData: jest.fn(),
    };
    (storage as any).set.mockImplementation(setMock);
    expect(
      setResultsTable(
        undefined,
        {
          timeFormat: 'ms',
        },
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
          timeFormat: 'ms',
        },
      },
    });
  });
});
