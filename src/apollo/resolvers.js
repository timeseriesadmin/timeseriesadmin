// @flow
import { query as influxQuery } from 'influx-api';
import gql from 'graphql-tag';
import Papa from 'papaparse';
import { ApolloError } from 'apollo-client';
import mergeWith from 'lodash/mergeWith';

import type { QueryParams } from 'influx-api';
import storage from '../helpers/storage';
import { getLatestVersion } from './resolvers/github';
import {
  databases,
  series,
  policies,
  measurements,
  fieldKeys,
  tagKeys,
  tagValues,
} from './resolvers/explorer';

export type ResultsSettings = {
  order: 'asc' | 'desc',
  orderKey: string,
  page: number,
  rowsPerPage: number,
  timeFormat: 's' | 'ms' | 'ns' | 'timestamp',
};

export const HISTORY_MAX_LENGTH = 30;

type FormParams = {
  url: string,
  u?: string,
  p?: string,
  db?: string, // required for most SELECT and SHOW queries
  q?: string,
};
export const resolvers = {
  Query: {
    getLatestVersion,
  },
  Mutation: {
    databases,
    series,
    policies,
    measurements,
    fieldKeys,
    tagKeys,
    tagValues,
    setOpenDrawer: (
      _obj: void,
      { isOpen }: { isOpen: boolean },
      { cache }: any,
    ): null => {
      cache.writeData({
        data: {
          isOpenDrawer: isOpen,
        },
      });
      storage.set('isOpenDrawer', isOpen ? 'true' : 'false');
      return null;
    },
    updateForm: (_obj: void, submitted: FormParams, { cache }: any): null => {
      const { form } = cache.readQuery({
        query: gql`
          {
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

      const newForm = {
        ...form,
        ...submitted,
        __typename: 'FormData',
      };
      storage.set('form', JSON.stringify(newForm));
      cache.writeData({
        data: {
          form: newForm,
        },
      });
      // it is important to return anything e.g. null (in other case you will see a warning)
      return null;
    },
    executeQuery: async (
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
          queryHistory = queryHistory.filter(
            hist => hist.query !== queryArgs.q,
          );
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
    },
    saveConnection: (
      _obj: void,
      { url, u, p, db }: FormParams,
      { cache }: any,
    ): null => {
      let { connections } = cache.readQuery({
        query: gql`
          {
            connections @client {
              id
              url
              u
              p
              db
            }
          }
        `,
      });
      if (!connections) {
        // initialize if empty
        connections = [];
      }

      const connection = {
        url,
        u,
        p,
        db,
        id: `${url}${u || '_'}${db || '_'}`,
        __typename: 'Connection',
      };

      const id = connections.findIndex(c => c.id === connection.id);
      if (id < 0) {
        connections.push(connection);
      } else {
        connections[id] = connection;
      }

      storage.set('connections', JSON.stringify(connections));
      cache.writeData({
        data: {
          connections,
        },
      });

      // it is important to return anything e.g. null (in other case you will see a warning)
      return null;
    },
    deleteConnection: (
      _obj: void,
      { id }: { id: string },
      { cache }: any,
    ): null => {
      let { connections } = cache.readQuery({
        query: gql`
          {
            connections @client {
              id
              url
              u
              p
              db
            }
          }
        `,
      });
      if (!connections) {
        // initialize if empty
        connections = [];
      }

      const index = connections.findIndex(c => c.id === id);
      if (index < 0) {
        // TODO: maybe report an error?
      } else {
        connections.splice(index, 1);
      }

      storage.set('connections', JSON.stringify(connections));
      cache.writeData({
        data: {
          connections,
        },
      });

      return null;
    },
    setResultsTable: (
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
    },
  },
};
