// @flow
import gql from 'graphql-tag';
import mergeWith from 'lodash/mergeWith';

import storage from '../../helpers/storage';

export type ResultsSettings = {
  order: 'asc' | 'desc',
  orderKey: string,
  page: number,
  rowsPerPage: number,
  timeFormat: 's' | 'ms' | 'ns' | 'timestamp',
};

export const setResultsTable = (
  _obj: void,
  changed: ResultsSettings,
  { cache }: any,
): null => {
  const { resultsTable } = cache.readQuery({
    query: gql`
      {
        resultsTable {
          order
          orderKey
          page
          rowsPerPage
          timeFormat
        }
      }
    `,
  });

  const newResultsSettings = mergeWith(
    { __typename: 'ResultsTable' },
    resultsTable,
    changed,
    // ignore overwriting with undefined while merging
    (a, b): any => (b === undefined ? a : undefined),
  );
  storage.set('timeFormat', newResultsSettings.timeFormat);

  cache.writeData({
    data: {
      resultsTable: newResultsSettings,
    },
  });
  // it is important to return anything e.g. null (in other case you will see a warning)
  return null;
};
