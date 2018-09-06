// @flow
import { query } from '../providers/influx';
import storage from '../helpers/storage';
import gql from 'graphql-tag';
import Papa from 'papaparse';

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
    // TODO: support multiserver with { id }: { id: string } args
    server: async (_: void, { id }: { id: string }, { cache }: any): Promise<any> => {
      const { form } = cache.readQuery({
        query: gql`{
          form { url u p }
        }`,
      });

			let queryArgs = { ...form, q: 'SHOW DATABASES', responseType: 'csv' };

      // $FlowFixMe
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
        query: gql`{
          form { url u p }
        }`,
      });

      // MEASUREMENTS
			let queryArgs = { ...form, q: 'SHOW MEASUREMENTS', db: id, responseType: 'csv' };

      // $FlowFixMe
      const queryResult = await query(queryArgs);

      let measurements = Papa.parse(queryResult.data.trim(), {
        header: true,
      });
      if (measurements.errors.length > 0) {
        throw new Error(JSON.stringify(measurements.errors));
      }

      // RETENTION POLICIES
      // $FlowFixMe
      const policiesResult = await query({
        ...queryArgs,
        q: `SHOW RETENTION POLICIES ON "${id}"`,
      });

      let policies = Papa.parse(policiesResult.data.trim(), {
        header: true
      });
      if (policies.errors.length > 0) {
        throw new Error(JSON.stringify(policies.errors));
      }

      // SERIES
      // $FlowFixMe
      const seriesResult = await query({
        ...queryArgs,
        q: `SHOW SERIES ON "${id}"`,
      });

      const series = Papa.parse(seriesResult.data.trim(), {
        header: true,
      });
      if (series.errors.length > 0) {
        throw new Error(JSON.stringify(series.errors));
      }

      return {
        __typename: 'Database',
        id,
        name: id,
        measurements: measurements.data.map(meas => ({
          ...meas,
          __typename: 'Measurement',
          id: meas.name,
        })),
        series: series.data.map(s => ({
          ...s,
          __typename: 'Series',
          id: s.key,
        })),
        retentionPolicies: policies.data.map(policy => ({
          ...policy,
          __typename: 'RetentionPolicy',
          id: policy.name,
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
    measurement: async (_: void, { id, db }: { id: string, db: string }, { cache }: any): Promise<any> => {
      const { form } = cache.readQuery({
        query: gql`{
          form { url u p }
        }`,
      });

      // FIELD KEYS
      const qArgs = {
        ...form,
        q: `SHOW FIELD KEYS FROM "${id}"`,
        responseType: 'csv',
        db,
      };

      // $FlowFixMe
      const keysResult = await query(qArgs);

      const fieldKeys = Papa.parse(keysResult.data.trim(), {
        header: true,
      });
      if (fieldKeys.errors.length > 0) {
        throw new Error(JSON.stringify(fieldKeys.errors));
      }

      // TAG KEYS
      // $FlowFixMe
      const tagsResult = await query({
        ...qArgs,
        q: `SHOW TAG KEYS FROM "${id}"`,
      });

      const tagKeys = Papa.parse(tagsResult.data.trim(), {
        header: true,
      });
      if (tagKeys.errors.length > 0) {
        throw new Error(JSON.stringify(tagKeys.errors));
      }

      return {
        __typename: 'Measurement',
        id,
        name: id,
        fieldKeys: fieldKeys.data.map(fKey => ({
          __typename: 'FieldKeys',
          id: fKey.fieldKey,
          name: fKey.fieldKey,
          type: fKey.fieldType,
        })),
        tagKeys: tagKeys.data.map(tKey => ({
          __typename: 'TagKeys',
          id: tKey.tagKey,
          name: tKey.tagKey,
        })),
      };
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
    tagKey: async (_: void, { id, meas, db }: { id: string, meas: string, db: string }, { cache }: any): Promise<any> => {
      const { form } = cache.readQuery({
        query: gql`{
          form { url u p }
        }`,
      });

      // FIELD KEYS
      const tagsResult = await query({
        ...form,
        q: `SHOW TAG VALUES ON "${db}" FROM "${meas}" WITH KEY = "${id}"`,
        responseType: 'csv',
        db,
      });
      const tagValues = Papa.parse(tagsResult.data.trim(), {
        header: true,
      });
      if (tagValues.errors.length > 0) {
        throw new Error(JSON.stringify(tagValues.errors));
      }

      // TODO: solve bug with tag key which equals measurement name
      return {
        __typename: 'TagKey',
        id,
        name: id,
        tagValues: tagValues.data.map(val => ({
          __typename: 'TagValue',
          id: val.value,
          name: val.value,
        })),
      };
    },
  },
};
