import { executeViaElectron } from './executeViaElectron';

import { getIpcRenderer } from 'src/apollo/helpers/getIpcRenderer';
jest.mock('apollo/helpers/getIpcRenderer');

const queryArgs = {
  url: 'http://test.test:8086',
  db: 'db',
  u: 'username',
  p: 'password',
  q: 'SELECT * FROM test',
};

describe('executeViaElectron()', () => {
  test('success', async () => {
    // given
    const send = jest.fn();
    const once = jest.fn(
      (param: string, cb: (evt: string, response: any) => void): any => {
        cb('', { response: 'response' });
      },
    );
    (getIpcRenderer as jest.Mock<any>).mockImplementation(() => ({
      send,
      once,
    }));

    // when
    const query = await executeViaElectron({
      queryArgs: queryArgs,
      rejectUnauthorized: true,
    });

    // then
    expect(send).toBeCalledWith('influx-query', {
      queryArgs,
      rejectUnauthorized: true,
    });
    expect(once).toBeCalledWith('influx-query-response', expect.anything());
    expect(query).toBe('response');
  });

  test('error', async () => {
    // given
    const send = jest.fn();
    const once = jest.fn(
      (param: string, cb: (evt: string, response: any) => void): any => {
        cb('', { error: 'error msg' });
      },
    );
    (getIpcRenderer as jest.Mock<any>).mockImplementation(() => ({
      send,
      once,
    }));

    // when
    try {
      await executeViaElectron({
        queryArgs: queryArgs,
        rejectUnauthorized: true,
      });
    } catch (e) {
      expect(e).toBe('error msg');
    }

    // then
    expect(send).toBeCalledWith('influx-query', {
      queryArgs,
      rejectUnauthorized: true,
    });
    expect(once).toBeCalledWith('influx-query-response', expect.anything());
    expect.assertions(3);
  });
});
