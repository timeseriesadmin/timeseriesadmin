// @flow
import { getForm } from '../resolvers/form';

import type { QueryParams } from 'influx-api';

// internal method exported just for tests
export const queryBase = (cache: any, query: string): QueryParams<'csv'> => {
  const form = getForm(cache);

  return {
    ...form,
    q: query,
    responseType: 'csv',
  };
};
