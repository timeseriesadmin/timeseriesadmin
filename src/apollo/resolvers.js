// @flow
import { query } from '../providers/influx';
import storage from '../helpers/storage';
import gql from 'graphql-tag';
import Papa from 'papaparse';

import type { QueryParams } from '../providers/influx/types';

const HISTORY_MAX_LENGTH = 30;

const queryBase = (cache: any, query: string) => {
  const { form } = cache.readQuery({
    query: gql`{
      form { url u p }
    }`,
  });
  
  return {
    ...form,
    q: query,
    responseType: 'csv',
  };
};

const parseResults = (result: string, remap: {[string]: string}, type: string) => {
  const response = result.trim();
  if (!response) {
    return null;
  }
  const results = Papa.parse(response, {
    header: true,
  });
  if (results.errors.length > 0) {
    throw new Error(JSON.stringify(results.errors));
  }
  // console.log(results);
  return results.data.map(entry => ({
    __typename: type,
    // TODO: this might be underperformant solution
    ...Object.keys(remap).reduce((acc, key) => ({...acc, [key]: entry[remap[key]] }), {}),
  }));
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
    // TODO: support multiserver with { url }: { url: string } args
    databases: async (_: void, _args: void, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, 'SHOW DATABASES'));
      return parseResults(result.data, {id: 'name', name: 'name'}, 'Database');
    },
    series: async (_: void, { db, meas }: { db: string, meas?: string }, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, `SHOW SERIES ON "${db}"${meas ? ` FROM "${meas}"`: ''}`));
      return parseResults(result.data, {id: 'key', key: 'key', tags: 'tags'}, 'Series');
    },
    policies: async (_: void, { db }: { db: string }, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, `SHOW RETENTION POLICIES ON "${db}"`));
      return parseResults(result.data, {id: 'name', name: 'name', duration: 'duration', shardGroupDuration: 'shardGroupDuration', replicaN: 'replicaN', default: 'default'}, 'RetentionPolicy');
    },
    measurements: async (_: void, { db }: { db: string }, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, `SHOW MEASUREMENTS ON "${db}"`));
      return parseResults(result.data, {id: 'name', name: 'name'}, 'Measurement');
    },
    fieldKeys: async (_: void, { db, meas }: { db: string, meas: string }, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, `SHOW FIELD KEYS ON "${db}" FROM "${meas}"`));
      return parseResults(result.data, {id: 'fieldKey', name: 'fieldKey', type: 'fieldType'}, 'FieldKey');
    },
    tagKeys: async (_: void, { db, meas }: { db: string, meas: string }, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, `SHOW TAG KEYS ON "${db}" FROM "${meas}"`));
      return parseResults(result.data, {id: 'tagKey', name: 'tagKey'}, 'TagKey');
    },
    tagValues: async (_: void, { db, meas, tagKey }: { db: string, meas: string, tagKey: string }, { cache }: any): Promise<any> => {
      // $FlowFixMe
      const result = await query(queryBase(cache, `SHOW TAG VALUES ON "${db}" FROM "${meas}" WITH KEY = "${tagKey}"`));
      return parseResults(result.data, {id: 'value', value: 'value'}, 'TagValue');
    },
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

    /*const fragment = gql`
    fragment getMeasurement on Measurement {
      id
      name
      fieldKeys {
        id
        name
        type
      }
      tagKeys {
        id
        name
      }
    }`;
    const result = cache.readFragment({ fragment, id: `Measurement:${id}` });
    return result;*/
  },
};
