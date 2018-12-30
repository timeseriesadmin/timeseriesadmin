// @flow
import gql from 'graphql-tag';
import { query as influxQuery } from 'influx-api';
import { ApolloError } from 'apollo-client';
import Papa from 'papaparse';

import storage from '../../helpers/storage';
import { HISTORY_MAX_LENGTH } from '../resolvers';

import type { QueryParams } from 'influx-api';

export const executeQuery = async (
  _: void,
  queryParams: QueryParams<'csv'>,
  { cache }: any,
): Promise<any> => {
  // TODO: ensure LIMIT if not provided but ONLY for SELECTs
  // if (q.indexOf('select') === 0 && q.indexOf('limit') === -1) {
  // q += ' limit 100'; // TODO: increase LIMIT value
  // }

  const readQuery = cache.readQuery({
    query: gql`
      {
        queryHistory {
          query
          error
        }
        form {
          url
          u
          p
          db
          q
        }
      }
    `,
  });
  let { queryHistory } = readQuery;
  const queryArgs = {
    ...readQuery.form,
    ...queryParams,
    responseType: 'csv',
  };

  let queryError;
  let queryResult;
  try {
    queryResult = await influxQuery(queryArgs);
  } catch (error) {
    queryError = error;
  }

  const historyIndex = queryHistory.findIndex(
    hist => hist.query === queryArgs.q,
  );

  if (historyIndex !== 0) {
    if (historyIndex > 0) {
      // remove any other history entries with same query
      queryHistory = queryHistory.filter(hist => hist.query !== queryArgs.q);
    }

    // add query as first history element
    queryHistory.unshift({
      query: queryArgs.q,
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
  }
  // else { in case query has index 0 do nothing (it is already at the top) }

  if (queryError) {
    let errorMessage = `${queryError.response.status}:${
      queryError.response.statusText
    } `;
    try {
      errorMessage += Papa.parse(queryError.response.data, {
        trimHeaders: true,
        skipEmptyLines: true,
      }).data[1][0];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    throw new ApolloError({
      errorMessage,
      networkError: queryError.response,
      extraInfo: queryError,
    });
  }

  // reset current page number to 0 (first page), orderKey and order
  const { resultsTable } = cache.readQuery({
    query: gql`
      {
        resultsTable {
          rowsPerPage
          timeFormat
        }
      }
    `,
  });
  cache.writeData({
    data: {
      resultsTable: {
        ...resultsTable,
        page: 0,
        orderKey: '',
        order: 'desc',
      },
    },
  });

  return {
    request: { params: queryArgs },
    response: queryResult,
  };
};
