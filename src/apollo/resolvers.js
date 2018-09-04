// @flow
import { query } from '../providers/influx';
import storage from '../helpers/storage';
import gql from 'graphql-tag';
import type { QueryParams } from '../providers/influx/types';

const HISTORY_MAX_LENGTH = 30;

type FormParams = {
  url?: string,
  u?: string,
  p?: string,
  db?: string, // required for most SELECT and SHOW queries
  q?: string,
};
export const resolvers = {
  Mutation: {
		setOpenDrawer: (_obj: void, { isOpen }: { isOpen: boolean }, { cache }: any): null => {
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
          query form {
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
      storage.set('form', JSON.stringify(newForm))
      cache.writeData({
        data: {
          form: newForm,
        },
      });
      // it is important to return anything e.g. null (in other case you will see a warning)
      return null;
    },
    executeQuery: async (_: void, queryParams: QueryParams, { cache }: any): Promise<any> => {
      // TODO: ensure LIMIT if not provided but ONLY for SELECTs
      // if (q.indexOf('select') === 0 && q.indexOf('limit') === -1) {
        // q += ' limit 100'; // TODO: increase LIMIT value
      // }

      let { queryHistory, form } = cache.readQuery({
        query: gql`
          query getData {
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
			let queryArgs = { ...form, ...queryParams, responseType: 'csv' };

      let queryError;
      let queryResult;
      try {
        queryResult = await query(queryArgs);
      } catch(error) {
        queryError = error;
      }

			// update query history
			// TODO: check if current query is same as last one if so don't add it to the history
      queryHistory.unshift({
        query: queryArgs.q,
        error: queryError ? JSON.stringify(queryError) : null,
        __typename: 'InfluxQuery',
      });

      // limit max length of query history
      queryHistory = queryHistory.slice(0, HISTORY_MAX_LENGTH);

      storage.set('queryHistory', JSON.stringify(queryHistory))
      cache.writeData({
        data: {
          queryHistory: queryHistory,
        },
      });

      if (queryError) {
        // TODO: improve error handling when 
        // https://github.com/apollographql/apollo-link-state/issues/282
        // gets resolved
        throw new Error(JSON.stringify(queryError));
        // return { data: 'error\n' + JSON.stringify(queryError)};
      }

      return {
				request: { params: queryArgs },
				response: queryResult,
			};
    },
 },
};
