import gql from 'graphql-tag';
import mergeWith from 'lodash/mergeWith';

import storage from '../../helpers/storage';

export type ResultsSettings = {
  timeFormat: 's' | 'ms' | 'ns' | 'timestamp';
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
