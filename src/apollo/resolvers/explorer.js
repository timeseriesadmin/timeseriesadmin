// @flow
import { query as influxQuery } from 'influx-api';
import { parseResults, queryBase } from './helpers';

// TODO: support multiserver with { url }: { url: string } args
export const databases = async (
  _: void,
  _args: void,
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(queryBase(cache, 'SHOW DATABASES'));
  return parseResults(result.data, { id: 'name', name: 'name' }, 'Database');
};

export const series = async (
  _: void,
  { db, meas }: { db: string, meas?: string },
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(
    queryBase(cache, `SHOW SERIES ON "${db}"${meas ? ` FROM "${meas}"` : ''}`),
  );
  return parseResults(
    result.data,
    { id: 'key', key: 'key', tags: 'tags' },
    'Series',
  );
};
export const policies = async (
  _: void,
  { db }: { db: string },
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(
    queryBase(cache, `SHOW RETENTION POLICIES ON "${db}"`),
  );
  return parseResults(
    result.data,
    {
      id: 'name',
      name: 'name',
      duration: 'duration',
      shardGroupDuration: 'shardGroupDuration',
      replicaN: 'replicaN',
      default: 'default',
    },
    'RetentionPolicy',
  );
};

export const measurements = async (
  _: void,
  { db }: { db: string },
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(
    queryBase(cache, `SHOW MEASUREMENTS ON "${db}"`),
  );
  return parseResults(result.data, { id: 'name', name: 'name' }, 'Measurement');
};

export const fieldKeys = async (
  _: void,
  { db, meas }: { db: string, meas: string },
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(
    queryBase(cache, `SHOW FIELD KEYS ON "${db}" FROM "${meas}"`),
  );
  return parseResults(
    result.data,
    { id: 'fieldKey', name: 'fieldKey', type: 'fieldType' },
    'FieldKey',
  );
};

export const tagKeys = async (
  _: void,
  { db, meas }: { db: string, meas: string },
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(
    queryBase(cache, `SHOW TAG KEYS ON "${db}" FROM "${meas}"`),
  );
  return parseResults(result.data, { id: 'tagKey', name: 'tagKey' }, 'TagKey');
};

export const tagValues = async (
  _: void,
  { db, meas, tagKey }: { db: string, meas: string, tagKey: string },
  { cache }: any,
): Promise<any> => {
  const result = await influxQuery(
    queryBase(
      cache,
      `SHOW TAG VALUES ON "${db}" FROM "${meas}" WITH KEY = "${tagKey}"`,
    ),
  );
  return parseResults(result.data, { id: 'value', value: 'value' }, 'TagValue');
};
