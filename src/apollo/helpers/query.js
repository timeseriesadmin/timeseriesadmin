// @flow
import gql from 'graphql-tag';

import type { QueryParams } from 'influx-api';

// internal method exported just for tests
export const queryBase = (cache: any, query: string): QueryParams<'csv'> => {
  const { form } = cache.readQuery({
    query: gql`
      {
        form {
          url
          u
          p
        }
      }
    `,
  });

  return {
    ...form,
    q: query,
    responseType: 'csv',
  };
};
