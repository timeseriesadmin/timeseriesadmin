import { queryBase } from 'src/apollo/helpers/queryBase';

export const executeQuery = async (_: void, queryParams: any): Promise<{}> => {
  // TODO: ensure LIMIT if not provided but ONLY for SELECTs
  // if (q.indexOf('select') === 0 && q.indexOf('limit') === -1) {
  // q += ' limit 100'; // TODO: increase LIMIT value
  // }

  return queryBase(queryParams, false);
};
