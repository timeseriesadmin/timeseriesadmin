// @flow
// Influx 1.6.0 API (https://docs.influxdata.com/influxdb/v1.6/tools/api)
// implemented with axios
import axios from 'axios';
import type { QueryParams, WriteParams, InfluxResponse, SingleQueryResult } from './types';
import qs from 'qs';
/*let requestParams = {
      q: query,
      // TODO: this should be configurable (probably)
      epoch: 'ms', // other options: h,m,s,ms,u,ns
      // TODO: how does those work
      // chunked: false, // or: true
      // 'max-row-limit': 10,
      db: undefined,
    };
    if (database) { // as database name is optional e.g. SHOW DATABASES :)
      requestParams.db = database;
    }
    data = qs.stringify(requestParams);*/

const post = async(params: QueryParams): Promise<InfluxResponse> => {
  let response;
  if (params.db) {
    params.url += `?db=${params.db}`;
  }
  try {
    let headers = {
      // 'Content-Type': 'application/x-www-form-urlencoded', // required to send query in POST body
      'Accept': 'application/json',
    };
    if (params.responseType && params.responseType === 'csv') {
      headers['Accept'] = 'application/csv';
    }
    if (params.responseType && params.responseType === 'msgpack') {
      headers['Accept'] = 'application/x-msgpack';
    }

    response = await axios({
      headers,
      url: params.url,
      data: qs.stringify({ q: params.q }),
      method: 'POST',
     // use Basic Auth headers if username is provided
      auth: params.u ? {
        username: params.u,
        password: params.p,
      } : undefined,
    });
  } catch(error) {
    if (typeof error.response === 'undefined') {
      // ensure some .response in case of
      // possibly preflight/CORS error (see: https://github.com/axios/axios/issues/838)
      error.response = {
        status: '',
        statusText: error.message,
        data: {
          error: `${error.message}. This might be a CORS error, network problem or invalid HTTPS redirect, invalid URL. Please check your connection configuration once more.`,
        },
      };
      throw error;
    }

    throw error;
  }
  // console.log(response);
  return response;
};

// converts connection params to URL
export const buildUrl = ({ host, ssl, port }: { host: string, ssl?: boolean, port?: number }) => {
  return `http${ssl ? 's' : ''}://${host}:${port ? port : 8086}`;
};

export const query = async(params: QueryParams): Promise<InfluxResponse> => {
	const queryParams = {
		...params,
		url: `${params.url}/query`,
	};

	return post(queryParams);
};

export const write = async(params: WriteParams): Promise<InfluxResponse> => {
  params.url += '/write';
  return post(params);
};

// return just first query result with only first series results
export const singleQuery = async(params: QueryParams): Promise<SingleQueryResult> => {
  const response: InfluxResponse = await query(params);

  if (!response.data || response.data.results.length !== 1
    || !response.data.results[0].series || response.data.results[0].series.length !== 1) {
    console.warn('singleQuery unexpected response: ', response);
    return [];
  }

  return response.data.results[0].series[0].values;
}

export const getDatabaseList = async(params: QueryParams): Promise<SingleQueryResult> =>
  singleQuery({ ...params, q: 'SHOW DATABASES' });

export const getMeasurementsList = async (args: QueryParams): Promise<SingleQueryResult> =>
  singleQuery({ ...args, q: 'SHOW MEASUREMENTS' });

/*


const baseQuery = async (args: InfluxQueryArgs, endpoint: string = '/query'): Promise<*> => {
  // console.log('args', args);
  // set default values
  const { host, query, database, username, password, port, ssl } = {
    port: 8086,
    ...args,
  };
  let url = 'http' + (ssl ? 's' : '') + '://' + host + ':' + port + '/' + endpoint;

  let data;
  if (endpoint === 'write') {
    url += '?db=' + database;
    // TODO: maybe binary encode (see: https://docs.influxdata.com/influxdb/v1.6/tools/api/#request-body-1) using Buffer?
    data = query;
  } else if (endpoint === 'query') {
    let requestParams = {
      q: query,
      // TODO: this should be configurable (probably)
      epoch: 'ms', // other options: h,m,s,ms,u,ns
      // TODO: how does those work
      // chunked: false, // or: true
      // 'max-row-limit': 10,
      db: undefined,
    };
    if (database) { // as database name is optional e.g. SHOW DATABASES :)
      requestParams.db = database;
    }
    data = qs.stringify(requestParams);
  }

  let response = undefined;
  try {
    response = await axios({
      url,
      data,
      method: 'POST',
      headers: {
        // required to send query in POST body
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: { // use Basic Auth headers
        username,
        password,
      },
    });
  } catch(error) {
    if (typeof error.response === 'undefined') {
      // possibly preflight/CORS error (see: https://github.com/axios/axios/issues/838)
      throw new Error(`${error.message}. This might be a CORS error, network problem or invalid HTTPS redirect. Please check your connection configuration once more.`);
    }
    // "standard" error (like 404, 401 etc.)
    throw new Error(`Response error ${error.response.status}: ${error.response.statusText}. Error data: ${JSON.stringify(error.response.data)}`);
  }

  console.log('response', response);
  return response;
};

export const simpleQuery = async (queryParams: InfluxQueryArgs, endpoint: string = '/query') => {
  let response;
  // try {
  response = await baseQuery(queryParams, endpoint);
  console.log('simpleQuery', response);
  // } catch (err) {
    // console.error('simpleQuery error: ', err);
    // return [];
  // }

  if (!response.data || response.data.results.length !== 1
    || !response.data.results[0].series || response.data.results[0].series.length !== 1) {
    console.warn('simpleQuery unexpected response: ', response);
    return [];
  }

  return response.data.results[0].series[0].values;
}

// TODO: use simpleQuery instead
export const getDatabaseList = async (args: InfluxQueryArgs) => {
  return simpleQuery({ ...args, query: 'SHOW DATABASES' });
};

// TODO: use simpleQuery instead
export const getMeasurementsList = async (args: InfluxQueryArgs) => {
  return simpleQuery({ ...args, query: 'SHOW MEASUREMENTS' });
}

/*import { InfluxDB } from 'influx';

const client = new InfluxDB({
  host: 'config.predictail.com',
  database: 'test',
  username: 'predictail_test',
  password: 'nu7eweMupH+P',
  protocol: 'https',
});

const baseQuery = async (args, endpoint = '/query'): Promise<*> => {
  const response = await client.writePoints([
    {
      measurement: 'test',
      fields: { cpu: 123, mem: 11 },
    }
  ]);
  // const response = await client.query('select * from test..test');
  return response;
}

export const simpleQuery = async (queryParams: InfluxQueryArgs, endpoint: string = '/query') => {
  let response;
  // try {
  response = await baseQuery(queryParams, endpoint);
  console.log('simpleQuery', response);
  // } catch (err) {
    // console.error('simpleQuery error: ', err);
    // return [];
  // }

  if (!response.data || response.data.results.length !== 1
    || !response.data.results[0].series || response.data.results[0].series.length !== 1) {
    console.warn('simpleQuery unexpected response: ', response);
    return [];
  }

  return response.data.results[0].series[0].values;
}

// TODO: use simpleQuery instead
export const getDatabaseList = async (args: InfluxQueryArgs) => {
  return baseQuery({ ...args, query: 'SHOW DATABASES' });
};

// TODO: use simpleQuery instead
export const getMeasurementsList = async (args: InfluxQueryArgs) => {
  return baseQuery({ ...args, query: 'SHOW MEASUREMENTS' });
}*/
