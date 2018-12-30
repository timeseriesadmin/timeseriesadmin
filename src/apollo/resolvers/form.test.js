import { updateForm } from './form';
import storage from '../../helpers/storage';
jest.mock('../../helpers/storage');

describe('form resolvers', () => {
  test('updateForm()', async () => {
    const setMock = jest.fn();
    const writeMock = jest.fn();
    const readMock = jest.fn(() => ({
      form: {
        url: 'http://url.test',
        u: 'user',
        p: 'pass',
        db: 'db',
        q: 'QUERY',
      },
    }));
    storage.set.mockImplementation(setMock);
    expect(
      updateForm(
        null,
        { u: 'new_user', p: 'new_pass' },
        { cache: { readQuery: readMock, writeData: writeMock } },
      ),
    ).toBe(null);
    expect(writeMock).toBeCalledWith({
      data: {
        form: {
          __typename: 'FormData',
          url: 'http://url.test',
          u: 'new_user',
          p: 'new_pass',
          db: 'db',
          q: 'QUERY',
        },
      },
    });
    expect(setMock).toBeCalledWith(
      'form',
      JSON.stringify({
        url: 'http://url.test',
        u: 'new_user',
        p: 'new_pass',
        db: 'db',
        q: 'QUERY',
        __typename: 'FormData',
      }),
    );
  });
});
