// @flow
type Consistency = 'any' | 'one' | 'quorum' | 'all';
type Precision = 'ns' | 'u' | 'ms' | 's' | 'm' | 'h';
type Chunked = true | number;

type InfluxParams = {|
  url: string,
  u?: string,
  p?: string,
  db?: string, // required for most SELECT and SHOW queries
  consistency?: Consistency,
  precision?: Precision,
  rp?: string,
  q?: string,
|};

export type QueryParams = {
  ...InfluxParams,
  chunked?: Chunked,
  epoch?: Precision,
  pretty?: boolean,
  q: string, // query without a query string makes no sense
  responseType?: 'json' | 'csv' | 'msgpack', // json is the default response type
};

// export type WriteParams = {
  // ...InfluxParams,
  // db: string, // is not optional for API write
// }

export type InfluxResponse = { data: { results: { series: { values: any[] }[] }[] } | string };

export type SingleQueryResult = string[][];
