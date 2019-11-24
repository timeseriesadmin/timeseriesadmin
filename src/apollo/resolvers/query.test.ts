import { executeQuery } from './query';

import { query } from 'influx-api';
import { getForm } from './form';
import { resetResultsTable } from '../helpers/results';
import { saveQueryHistory } from '../helpers/history';
import { handleQueryError } from '../helpers/errors';
jest.mock('./form');
jest.mock('../helpers/results');
jest.mock('../helpers/history');
jest.mock('../helpers/errors');
jest.mock('influx-api');

describe('query resolvers', () => {
  test('successful executeQuery()', async () => {
    query.mockImplementation(
      () => 'name,tags,name\ndatabases,db_tag1,test\ndatabases,,_internal',
    );
    (getForm as any).mockImplementation(() => ({
      url: 'http://test.test:8086',
      u: 'username',
    }));

    const res = await executeQuery(
      undefined,
      { q: 'SELECT * FROM test' },
      { cache: null },
    );

    expect(handleQueryError).toBeCalledTimes(1);
    expect(handleQueryError).toBeCalledWith(undefined);

    expect(saveQueryHistory).toBeCalledTimes(1);
    expect(saveQueryHistory).toBeCalledWith(
      'SELECT * FROM test',
      null,
      undefined,
    );

    expect(resetResultsTable).toBeCalledTimes(1);
    expect(resetResultsTable).toBeCalledWith(null);

    expect(res).toEqual({
      request: {
        params: {
          q: 'SELECT * FROM test',
          responseType: 'csv',
          url: 'http://test.test:8086',
          u: 'username',
        },
      },
      response: 'name,tags,name\ndatabases,db_tag1,test\ndatabases,,_internal',
    });
  });

  test('error in executeQuery()', async () => {
    (handleQueryError as any).mockClear();
    const error = new Error('something');
    query.mockImplementation(() => {
      throw error;
    });

    await executeQuery(undefined, { q: 'SELECT * FROM test' }, { cache: null });

    expect(handleQueryError).toBeCalledTimes(1);
    expect(handleQueryError).toBeCalledWith(error);
  });
});
