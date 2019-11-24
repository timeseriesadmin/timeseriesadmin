import { getForm } from '../resolvers/form';

// internal method exported just for tests
export const queryBase = (cache: any, query: string): string[] => {
  const form = getForm(cache);

  return {
    ...form,
    q: query,
    responseType: 'csv',
  };
};
