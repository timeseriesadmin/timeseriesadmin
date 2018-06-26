// @flow
import { query, buildUrl } from './index';

jest.mock('./__mocks__/axios');

describe('buildUrl', () => {
  it('works as expected', () => {
    expect(buildUrl({ host: 'test.test', ssl: true, port: 8081 })).toEqual('https://test.test:8081');
    expect(buildUrl({ host: 'test.test' })).toEqual('http://test.test:8086');
    expect(buildUrl({ host: 'test.test', ssl: false, port: 123 })).toEqual('http://test.test:123');
  });
});

// A simple example test
describe('query', () => {
  it('query data', async () => {
    const data = await query({
      url: 'any.localhost',
      q: 'SELECT * FROM test..test',
    });
    expect(data).toEqual({
      data: {
        results: [{ series: [{ values: [['db12'], ['db34']] }] }],
      },
    });
  });
});
