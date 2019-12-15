import qs from 'qs';
import axios from 'axios';

export async function influxRequest({
  q,
  u,
  p,
  url,
  db,
  ...axiosParams
}: any): Promise<any> {
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
