// @flow
import { query } from '../providers/influx';
import storage from '../helpers/storage';
import gql from 'graphql-tag';
import type { QueryParams } from '../providers/influx/types';

const HISTORY_MAX_LENGTH = 30;

type ExploreArgs = {
	type: 'databases' | 'measurements' | 'field_keys' | 'field_tags' | 'series',
};
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
    // TODO: support multiserver with { id }: { id: string } args
    server: async (_: void, { id }: { id: string }, { cache }: any): Promise<any> => {
      const { form } = cache.readQuery({
        query: gql`
          query form {
            form {
              url
              u
              p
            }
          }
        `,
      });

			let queryArgs = { ...form, q: 'SHOW DATABASES', responseType: 'csv' };

      const queryResult = await query(queryArgs);

      let databases = queryResult.data.split('\n');
      if (databases.length > 0) {
        databases.shift(); // remove header
      }

      databases = databases.map(line => line.split(',')[2])
        .filter(name => !!name);

      /*cache.writeData({
        data: {
          server: {
            __typename: 'Server',
            id: `${form.u}@${form.url}`,
            databases: databases.map(name => ({
              __typename: 'Database',
              id: name,
              name,
            })),
          },
        },
      });

      const fragment = gql`
      fragment getServer on Server {
        id
        name
        databases {
          id
          name
        }
      }`;
      const result = cache.readFragment({ fragment, id: `Server:${id}` });*/
      // return result;
      return {
        __typename: 'Server',
        id: `${form.u}@${form.url}`,
        name: `${form.u}@${form.url}`,
        databases: databases.map(name => ({
          __typename: 'Database',
          id: name,
          name,
        })),
      };
    },
    database: async (_: void, { id }: { id: string }, { cache }: any): Promise<any> => {
      const { form } = cache.readQuery({
        query: gql`
          query form {
            form {
              url
              u
              p
            }
          }
        `,
      });

			let queryArgs = { ...form, q: 'SHOW MEASUREMENTS', db: id, responseType: 'csv' };

      const queryResult = await query(queryArgs);

      let measurements = queryResult.data.split('\n');
      if (measurements.length > 0) {
        measurements.shift(); // remove header
      }

      measurements = measurements.map(line => line.split(',')[2])
        .filter(name => !!name);

      return {
        __typename: 'Database',
        id,
        name: id,
        measurements: measurements.map(name => ({
          __typename: 'Measurement',
          id: name,
          name,
        })),
      };

      /*const fragment = gql`
      fragment getDatabase on Database {
        id
        name
        measurements {
          id
          name
        }
      }`;
      const result = cache.readFragment({ fragment, id: `Database:${id}` });
      return result;*/
    },
    measurement: async (_: void, { id }: { id: string }, { cache }: any): Promise<any> => {
      const fragment = gql`
      fragment getMeasurement on Measurement {
        id
        name
        fieldKeys {
          id
          name
          type
        }
        fieldTags {
          id
          name
        }
      }`;
      const result = cache.readFragment({ fragment, id: `Measurement:${id}` });
      return result;
    },
  },
};
