import { queryBase } from 'apollo/helpers/queryBase';

jest.mock('influx-api');
import { query as influxQuery } from 'influx-api';
jest.mock('apollo/resolvers/form');
import { getForm } from 'apollo/resolvers/form';
jest.mock('apollo/helpers/results');
import { resetResultsTable } from 'apollo/helpers/results';
jest.mock('apollo/helpers/history');
import { saveQueryHistory } from 'apollo/helpers/history';
jest.mock('apollo/helpers/errors');
import { handleQueryError } from 'apollo/helpers/errors';
jest.mock('apollo/helpers/isElectron');
import { isElectron } from 'apollo/helpers/isElectron';
jest.mock('apollo/helpers/executeViaElectron');
import { executeViaElectron } from 'apollo/helpers/executeViaElectron';

const queryArgs = {
  url: 'http://test.test:8086',
  db: 'db',
  u: 'username',
  p: 'password',
  q: 'SELECT * FROM test',
};

describe('queryBase()', () => {
  test('automatic explorer query', async () => {
    // given
    (isElectron as jest.Mock<any>).mockReturnValue(true);
    (getForm as jest.Mock<any>).mockReturnValue({ unsafeSsl: false });
    (executeViaElectron as jest.Mock<any>).mockReturnValue(
      Promise.resolve('response'),
    );

    // when
    const query = await queryBase('cache', queryArgs, false);

    // then
    expect(getForm).toBeCalledWith('cache');
    expect(executeViaElectron).toBeCalledWith({
      queryArgs: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
      rejectUnauthorized: true,
    });
    expect(query).toStrictEqual({
      request: {
        params: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
      },
      response: 'response',
    });
    expect(saveQueryHistory).not.toBeCalled();
    expect(handleQueryError).not.toBeCalled();
    expect(resetResultsTable).not.toBeCalled();
  });

  describe('manual user query', () => {
    test('success', async () => {
      // given
      (isElectron as jest.Mock<any>).mockReturnValue(true);
      (getForm as jest.Mock<any>).mockReturnValue({ unsafeSsl: false });
      (executeViaElectron as jest.Mock<any>).mockReturnValue(
        Promise.resolve('response'),
      );

      // when
      const query = await queryBase('cache', queryArgs, true);

      // then
      expect(getForm).toBeCalledWith('cache');
      expect(executeViaElectron).toBeCalledWith({
        queryArgs: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
        rejectUnauthorized: true,
      });
      expect(query).toStrictEqual({
        request: {
          params: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
        },
        response: 'response',
      });
      expect(saveQueryHistory).toBeCalledWith(queryArgs.q, 'cache', undefined);
      expect(handleQueryError).toBeCalledWith(undefined);
      expect(resetResultsTable).toBeCalledWith('cache');
    });

    test('error', async () => {
      // given
      (isElectron as jest.Mock<any>).mockReturnValue(true);
      (getForm as jest.Mock<any>).mockReturnValue({ unsafeSsl: false });
      (executeViaElectron as jest.Mock<any>).mockReturnValue(
        Promise.reject('error message'),
      );

      // when
      const query = await queryBase('cache', queryArgs, true);

      // then
      expect(getForm).toBeCalledWith('cache');
      expect(executeViaElectron).toBeCalledWith({
        queryArgs: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
        rejectUnauthorized: true,
      });
      expect(query).toStrictEqual({
        request: {
          params: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
        },
        response: undefined,
      });
      expect(saveQueryHistory).toBeCalledWith(
        queryArgs.q,
        'cache',
        'error message',
      );
      expect(handleQueryError).toBeCalledWith('error message');
      expect(resetResultsTable).toBeCalledWith('cache');
    });

    test('non-electron success', async () => {
      // given
      (isElectron as jest.Mock<any>).mockReturnValue(false);
      (getForm as jest.Mock<any>).mockReturnValue({ unsafeSsl: false });
      (influxQuery as jest.Mock<any>).mockReturnValue(
        Promise.resolve('response'),
      );

      // when
      const query = await queryBase('cache', queryArgs, true);

      // then
      expect(getForm).toBeCalledWith('cache');
      expect(executeViaElectron).toBeCalledWith({
        queryArgs: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
        rejectUnauthorized: true,
      });
      expect(query).toStrictEqual({
        request: {
          params: { ...queryArgs, responseType: 'csv', unsafeSsl: false },
        },
        response: 'response',
      });
      expect(saveQueryHistory).toBeCalledWith(queryArgs.q, 'cache', undefined);
      expect(handleQueryError).toBeCalledWith(undefined);
      expect(resetResultsTable).toBeCalledWith('cache');
    });
  });
});
