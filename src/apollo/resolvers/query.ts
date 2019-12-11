import { queryBase } from 'apollo/helpers/query';
import { QueryArgs } from 'influx-api';

export const executeQuery = async (
  _: void,
  queryParams: QueryArgs,
  { cache }: any,
): Promise<{}> => {
  // TODO: ensure LIMIT if not provided but ONLY for SELECTs
  // if (q.indexOf('select') === 0 && q.indexOf('limit') === -1) {
  // q += ' limit 100'; // TODO: increase LIMIT value
  // }

  return queryBase(cache, queryParams, false);
};
