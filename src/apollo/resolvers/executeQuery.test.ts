import { executeQuery } from './executeQuery';

import { queryBase } from 'src/apollo/helpers/queryBase';
jest.mock('apollo/helpers/queryBase');

describe('executeQuery()', () => {
  test('is handled by queryBase() helper', async () => {
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
  });
});
