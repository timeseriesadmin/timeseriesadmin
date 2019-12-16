import { executeViaElectron } from './executeViaElectron';

jest.mock('./getIpcRenderer');
import { getIpcRenderer } from './getIpcRenderer';

const params = {
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
      (param: string, cb: (evt: string, params: any) => void): any => {
        cb('', { response: 'response' });
      },
    );
    (getIpcRenderer as jest.Mock<any>).mockReturnValueOnce({
      send,
      once,
    });

    // when
    const query = await executeViaElectron(params);

    // then
    expect(send).toBeCalledWith('influx-query', { params });
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
    (getIpcRenderer as jest.Mock<any>).mockReturnValue({
      send,
      once,
    });

    // when
    const query = executeViaElectron(params);

    // then
    await expect(query).rejects.toBe('error msg');
    expect(send).toBeCalledWith('influx-query', { params });
    expect(once).toBeCalledWith('influx-query-response', expect.anything());
  });
});
