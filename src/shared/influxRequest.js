const qs = require('qs');
const axios = require('axios');

export async function influxRequest({ q, u, p, url, db, ...axiosParams }) {
  return axios({
    headers: {
      Accept: 'application/csv',
    },
    data: qs.stringify({ q }),
    auth: {
      username: u,
      password: p,
    },
    url: url + '/query',
    method: 'POST',
    params: {
      q,
      db,
    },
    ...axiosParams,
  });
}

// exports.influxRequest = influxRequest;

// module.exports.influxRequest = influxRequest;
