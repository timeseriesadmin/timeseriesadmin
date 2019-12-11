import { parseResults } from '../helpers/parser';
import { queryBase } from 'apollo/helpers/queryBase';

// TODO: support multiserver with { url }: { url: string } args
export const databases = async (
  _: void,
  _args: void,
  { cache }: any,
): Promise<any> => {
  const result = await queryBase(cache, { q: 'SHOW DATABASES' }, false);
  return parseResults(result.data, { id: 'name', name: 'name' }, 'Database');
};

export const series = async (
  _: void,
  { db, meas }: { db: string; meas?: string },
  { cache }: any,
): Promise<any> => {
  const result = await queryBase(
    cache,
    { q: `SHOW SERIES ON "${db}"${meas ? ` FROM "${meas}"` : ''}` },
    false,
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
  const result = await queryBase(
    cache,
    { q: `SHOW RETENTION POLICIES ON "${db}"` },
    false,
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
  const result = await queryBase(
    cache,
    { q: `SHOW MEASUREMENTS ON "${db}"` },
    false,
  );
  return parseResults(result.data, { id: 'name', name: 'name' }, 'Measurement');
};

export const fieldKeys = async (
  _: void,
  { db, meas, retPol }: { db: string; meas: string; retPol?: string },
  { cache }: any,
): Promise<any> => {
  if (!retPol) {
    // if not provided use "autogen" policy
    retPol = 'autogen';
  }
  const result = await queryBase(
    cache,
    { q: `SHOW FIELD KEYS ON "${db}" FROM "${retPol}"."${meas}"` },
    false,
  );
  return parseResults(
    result.data,
    { id: 'fieldKey', name: 'fieldKey', type: 'fieldType' },
    'FieldKey',
  );
};

export const tagKeys = async (
  _: void,
  { db, meas }: { db: string; meas: string },
  { cache }: any,
): Promise<any> => {
  const result = await queryBase(
    cache,
    { q: `SHOW TAG KEYS ON "${db}" FROM "${meas}"` },
    false,
  );
  return parseResults(result.data, { id: 'tagKey', name: 'tagKey' }, 'TagKey');
};

export const tagValues = async (
  _: void,
  { db, meas, tagKey }: { db: string; meas: string; tagKey: string },
  { cache }: any,
): Promise<any> => {
  const result = await queryBase(
    cache,
    { q: `SHOW TAG VALUES ON "${db}" FROM "${meas}" WITH KEY = "${tagKey}"` },
    false,
  );
  return parseResults(result.data, { id: 'value', value: 'value' }, 'TagValue');
};
