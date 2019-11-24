import gql from 'graphql-tag';
import storage from '../../helpers/storage';

import { HISTORY_MAX_LENGTH } from '../../config';

// exported only for tests
export const saveQueryHistory = (
  query: string,
  cache: any,
  queryError: any,
) => {
  let { queryHistory } = cache.readQuery({
    query: gql`
      {
        queryHistory {
          query
          error
        }
      }
    `,
  });

  const queryToSave = query.trim();
  const historyIndex = queryHistory.findIndex(
    (hist: { query: string }) => hist.query === queryToSave,
  );

  if (historyIndex === 0) {
    // already at the top of the history list
    return false;
  }

  if (historyIndex > 0) {
    // remove any other history entries with same query
    queryHistory = queryHistory.filter(
      (hist: { query: string }) => hist.query !== queryToSave,
    );
  }

  // add query as first history element
  queryHistory.unshift({
    query: queryToSave,
    error: queryError ? JSON.stringify(queryError) : null,
    __typename: 'InfluxQuery',
  });

  // limit max length of query history
  queryHistory = queryHistory.slice(0, HISTORY_MAX_LENGTH);

  storage.set('queryHistory', JSON.stringify(queryHistory));
  cache.writeData({
    data: {
      queryHistory,
    },
  });

  return queryHistory;
};
