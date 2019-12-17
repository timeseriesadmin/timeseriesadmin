import { queryBase } from './queryBase';

jest.mock('./isElectron');
import { isElectron } from './isElectron';
jest.mock('./executeViaElectron');
import { executeViaElectron } from './executeViaElectron';
jest.mock('./parseQueryResults');
import { parseQueryResults } from './parseQueryResults';
jest.mock('../shared/influxRequest');
import { influxRequest } from '../shared/influxRequest';

const queryArgs = {
  url: 'http://test.test:8086',
  db: 'db',
  u: 'username',
  p: 'password',
  q: 'SELECT * FROM test',
};

describe('queryBase()', () => {
  test('success', async () => {
    // given
    (isElectron as jest.Mock<any>).mockReturnValue(false);
    (influxRequest as jest.Mock<any>).mockReturnValue(
      Promise.resolve({ data: 'response' }),
    );
    (parseQueryResults as jest.Mock<any>).mockReturnValue('parsed response');

    // when
    const query = await queryBase(queryArgs);

    // then
    expect(influxRequest).toBeCalledWith(queryArgs);
    expect(query).toStrictEqual({
      request: {
        params: queryArgs,
      },
      response: { data: 'parsed response' },
    });
    expect(parseQueryResults).toBeCalledWith('response');
    expect(executeViaElectron).not.toBeCalled();
  });

  test('error', async () => {
    // given
    (isElectron as jest.Mock<any>).mockReturnValue(false);
    (influxRequest as jest.Mock<any>).mockReturnValue(
      Promise.reject('some error'),
    );
    (parseQueryResults as jest.Mock<any>).mockClear();

    // when
    await expect(queryBase(queryArgs)).rejects.toBe('some error');

    // then
    expect(influxRequest).toBeCalledWith(queryArgs);
    expect(parseQueryResults).not.toBeCalled();
    expect(executeViaElectron).not.toBeCalled();
  });

  test('through electron', async () => {
    // given
    (isElectron as jest.Mock<any>).mockReturnValue(true);
    (parseQueryResults as jest.Mock<any>).mockReturnValue('parsed response');
    (executeViaElectron as jest.Mock<any>).mockReturnValue(
      Promise.resolve({ data: 'response' }),
    );
    influxRequest.mockClear();

    // when
    const query = await queryBase(queryArgs);

    // then
    expect(executeViaElectron).toBeCalledWith({
      ...queryArgs,
      rejectUnauthorized: true,
    });
    expect(query).toStrictEqual({
      request: {
        params: {
          ...queryArgs,
        },
      },
      response: { data: 'parsed response' },
    });
    expect(parseQueryResults).toBeCalledWith('response');
    expect(influxRequest).not.toBeCalled();
  });
});
