import { influxRequest } from './influxRequest';

jest.mock('axios');
import axios from 'axios';

describe('influxRequest()', () => {
  test('base request with additional Axios params', async () => {
    // given
    const params = {
      q: 'SELECT * FROM test',
      u: 'admin',
      p: 'admin',
      url: 'http://test.test',
      db: 'test',
      // additional Axios params
      proxy: {
        host: '127.0.0.1',
        port: 9000,
        auth: {
          username: 'mikeymike',
          password: 'rapunz3l',
        },
      },
    };
    (axios as jest.Mock<any>).mockResolvedValue('test');

    // when
    const response = await influxRequest(params);

    // then
    expect(response).toBe('test');
    expect(axios).toBeCalledTimes(1);
    expect(axios).toBeCalledWith({
      headers: {
        Accept: 'application/csv',
      },
      data: 'q=SELECT%20%2A%20FROM%20test',
      auth: {
        username: 'admin',
        password: 'admin',
      },
      url: 'http://test.test/query',
      method: 'POST',
      params: {
        q: 'SELECT * FROM test',
        db: 'test',
      },
      proxy: {
        host: '127.0.0.1',
        port: 9000,
        auth: {
          username: 'mikeymike',
          password: 'rapunz3l',
        },
      },
    });
  });
});
