import { executeQuery } from './query';

import { queryBase } from '../helpers/query';
jest.mock('../helpers/query');

describe('executeQuery()', () => {
  test('is handled by queryBase() helper', async () => {
    // query.mockImplementation(
    //   () => 'name,tags,name\ndatabases,db_tag1,test\ndatabases,,_internal',
    // );
    // (getForm as any).mockImplementation(() => ({
    //   url: 'http://test.test:8086',
    //   u: 'username',
    // }));

    // const res = await executeQuery(
    //   undefined,
    //   { q: 'SELECT * FROM test' },
    //   { cache: null },
    // );
    const queryArgs = {
      q: 'SELECT * FROM test',
      url: '',
      db: '',
      u: '',
      p: '',
    };

    executeQuery(undefined, queryArgs, { cache: 'cache' });

    expect(queryBase).toBeCalledTimes(1);
    expect(queryBase).toBeCalledWith('cache', queryArgs, false);

    // expect(handleQueryError).toBeCalledTimes(1);
    // expect(handleQueryError).toBeCalledWith(undefined);

    // expect(saveQueryHistory).toBeCalledTimes(1);
    // expect(saveQueryHistory).toBeCalledWith(
    //   'SELECT * FROM test',
    //   null,
    //   undefined,
    // );

    // expect(resetResultsTable).toBeCalledTimes(1);
    // expect(resetResultsTable).toBeCalledWith(null);

    // expect(res).toEqual({
    //   request: {
    //     params: {
    //       q: 'SELECT * FROM test',
    //       responseType: 'csv',
    //       url: 'http://test.test:8086',
    //       u: 'username',
    //     },
    //   },
    //   response: 'name,tags,name\ndatabases,db_tag1,test\ndatabases,,_internal',
    // });
  });

  // test('error in executeQuery()', async () => {
  //   (handleQueryError as any).mockClear();
  //   const error = new Error('something');
  //   query.mockImplementation(() => {
  //     throw error;
  //   });

  //   await executeQuery(undefined, { q: 'SELECT * FROM test' }, { cache: null });

  //   expect(handleQueryError).toBeCalledTimes(1);
  //   expect(handleQueryError).toBeCalledWith(error);
  // });
});
