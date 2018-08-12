// @flow
// Local apollo-link-state resolvers
// import gql from 'graphql-tag';
import { query } from '../providers/influx';
import storage from '../helpers/storage';

import type { QueryParams } from '../providers/influx/types';

const form = storage.get('form');
export const defaults = {
  form: !form ? null : { url: '', u: '', p: '', db: '', q: '', ...JSON.parse(form) },
  results: null,
};

export const resolvers = {
  Mutation: {
    updateForm: (_obj: void, submitted: QueryParams, { cache }: any): null => {
      const form = {
        ...submitted,
        __typename: 'FormData',
      };
      storage.set('form', JSON.stringify(form))
      cache.writeData({
        data: {
          form,
        },
      });
      // it is important to return anything e.g. null (in other case you will see a warning)
      return null;
    },
    influxQuery: async (_: void, { url, u, p, db, q }: QueryParams, { cache }: any): Promise<null> => {
      q = q.toLowerCase();
      // cache.writeData({
        // data: {
          // connection: { url, u, p, db },
        // },
      // });

      // ensure LIMIT if not provided
      if (q.indexOf('select') === 0 && q.indexOf('limit') === -1) {
        q += ' limit 10'; // TODO: increase LIMIT value
      }

      const result = await query({ url, u, p, db, q, responseType: 'csv' });

      cache.writeData({
        data: {
          results: {
            data: result.data,
            type: 'csv',
            __typename: 'Results',
          },
        },
      });
      return null;
    },
 },
};
