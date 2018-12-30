import { query } from 'influx-api';
import { queryBase } from './helpers';
import {
  databases,
  series,
  policies,
  measurements,
  fieldKeys,
  tagKeys,
  tagValues,
} from './explorer';
jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers'),
  queryBase: jest.fn(),
}));
jest.mock('influx-api');

describe('explorer resolvers', () => {
  test('database()', async () => {
    query.mockImplementation(() => ({
      data: 'name,tags,name\ndatabases,db_tag1,test\ndatabases,,_internal',
    }));
    expect(await databases(null, null, { cache: null })).toEqual([
      { id: 'test', name: 'test', __typename: 'Database' },
      { id: '_internal', name: '_internal', __typename: 'Database' },
    ]);
  });

  test('series()', async () => {
    query.mockImplementation(() => ({
      data: 'name,tags,key\n,,"s1,tag1=tagval_1"\n,,"s1,tag1=tagval2"\n',
    }));
    const res = await series(null, { db: 'db', meas: 'meas' }, { cache: null });
    expect(queryBase).toBeCalledWith(null, 'SHOW SERIES ON "db" FROM "meas"');
    expect(res).toEqual([
      {
        __typename: 'Series',
        id: 's1,tag1=tagval_1',
        key: 's1,tag1=tagval_1',
        tags: '',
      },
      {
        __typename: 'Series',
        id: 's1,tag1=tagval2',
        key: 's1,tag1=tagval2',
        tags: '',
      },
    ]);

    await series(null, { db: 'db' }, { cache: null });
    expect(queryBase).toBeCalledWith(null, 'SHOW SERIES ON "db"');
  });

  test('policies()', async () => {
    query.mockImplementation(() => ({
      data:
        'name,tags,name,duration,shardGroupDuration,replicaN,default\n' +
        ',,autogen,720h0m0s,168h0m0s,1,true',
    }));
    const res = await policies(null, { db: 'db' }, { cache: null });
    expect(queryBase).toBeCalledWith(null, 'SHOW RETENTION POLICIES ON "db"');
    expect(res).toEqual([
      {
        __typename: 'RetentionPolicy',
        default: 'true',
        duration: '720h0m0s',
        id: 'autogen',
        name: 'autogen',
        replicaN: '1',
        shardGroupDuration: '168h0m0s',
      },
    ]);
  });

  test('measurements()', async () => {
    query.mockImplementation(() => ({
      data: 'name,tags,name\nmeasurements,,meas1\nmeasurements,,meas2\n',
    }));
    const res = await measurements(null, { db: 'db' }, { cache: null });
    expect(queryBase).toBeCalledWith(null, 'SHOW MEASUREMENTS ON "db"');
    expect(res).toEqual([
      { __typename: 'Measurement', id: 'meas1', name: 'meas1' },
      { __typename: 'Measurement', id: 'meas2', name: 'meas2' },
    ]);
  });

  test('fieldKeys()', async () => {
    query.mockImplementation(() => ({
      data:
        'name,tags,fieldKey,fieldType\nfk_name_1,,fk1,integer\nfk_name_2,fk_tag,fk2,integer\n',
    }));
    const res = await fieldKeys(
      null,
      { db: 'db', meas: 'meas' },
      { cache: null },
    );
    expect(queryBase).toBeCalledWith(
      null,
      'SHOW FIELD KEYS ON "db" FROM "meas"',
    );
    expect(res).toEqual([
      { __typename: 'FieldKey', id: 'fk1', name: 'fk1', type: 'integer' },
      { __typename: 'FieldKey', id: 'fk2', name: 'fk2', type: 'integer' },
    ]);
  });

  test('tagKeys()', async () => {
    query.mockImplementation(() => ({
      data: 'name,tags,tagKey\ntag_key_name,,tk_1\ntag_key_name2,,tk_2',
    }));
    const res = await tagKeys(
      null,
      { db: 'db', meas: 'meas' },
      { cache: null },
    );
    expect(queryBase).toBeCalledWith(null, 'SHOW TAG KEYS ON "db" FROM "meas"');
    expect(res).toEqual([
      { __typename: 'TagKey', id: 'tk_1', name: 'tk_1' },
      { __typename: 'TagKey', id: 'tk_2', name: 'tk_2' },
    ]);
  });

  test('tagValues()', async () => {
    query.mockImplementation(() => ({
      data:
        'name,tags,key,value\nmeas,,tk_1,tag_value1\nmeas,,tk_1,tag_value2\nmeas,,tk_1,tag_value3\n',
    }));
    const res = await tagValues(
      null,
      { db: 'db', meas: 'meas', tagKey: 'tk_1' },
      { cache: null },
    );
    expect(queryBase).toBeCalledWith(
      null,
      'SHOW TAG VALUES ON "db" FROM "meas" WITH KEY = "tk_1"',
    );
    expect(res).toEqual([
      { __typename: 'TagValue', id: 'tag_value1', value: 'tag_value1' },
      { __typename: 'TagValue', id: 'tag_value2', value: 'tag_value2' },
      { __typename: 'TagValue', id: 'tag_value3', value: 'tag_value3' },
    ]);
  });
});
