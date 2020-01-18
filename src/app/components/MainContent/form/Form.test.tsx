import React from 'react';
import { render, waitForElement, fireEvent } from 'utils/test-utils';

// The component AND the query need to be exported
import FormInflux, { GET_INITIAL, SAVE_CONNECTION } from './Form';

const mocks = [
  {
    request: {
      query: GET_INITIAL,
    },
    result: {
      data: {
        form: {
          url: 'http://test.test:8086',
          u: 'test_user',
          p: 'test_pass',
          db: 'test_db',
          q: 'test query',
          unsafeSsl: false,
        },
      },
    },
  },
  {
    request: {
      query: SAVE_CONNECTION,
    },
  },
];

describe('<FormInflux />', () => {
  test('rendering and submitting', async () => {
    // spy has to be async to properly trigger "submitting" form state
    const spy: any = jest.fn(async () => undefined);
    const {
      queryByText,
      getByText,
      getByLabelText,
      getByTestId,
    } = render(<FormInflux onSubmit={spy} />, { mocks });
    expect(getByText('Loading data...')).toBeDefined();

    await waitForElement(() => getByText('Run query'));

    expect(getByLabelText('Database URL').value).toBe('http://test.test:8086');
    expect(getByLabelText('User').value).toBe('test_user');
    expect(getByLabelText('Password').value).toBe('test_pass');
    expect(getByLabelText('Database').value).toBe('test_db');
    expect(getByLabelText('Query').value).toBe('test query');
    expect(getByLabelText('Password').value).toBe('test_pass');

    // toggle password visibility
    expect(queryByText('test_pass')).toBeNull();
    fireEvent.click(getByTestId('password-visibility-toggle'));
    expect(queryByText('test_pass')).toBeDefined();

    fireEvent.submit(getByText('Run query')); // .click() doesn't work, it has to be .submit()
    await waitForElement(() => getByText('Executing query...'));
    await waitForElement(() => getByText('Run query'));
    expect(spy).toBeCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({
      db: 'test_db',
      p: 'test_pass',
      q: 'test query',
      u: 'test_user',
      url: 'http://test.test:8086',
      unsafeSsl: false,
    });

    // simulate CTRL/CMD + ENTER
    fireEvent.keyDown(getByLabelText('Query'), {
      key: 'Enter',
      keyCode: 13,
      which: 13,
      metaKey: true,
      ctrlKey: true,
    });
    await waitForElement(() => getByText('Executing query...'));
    await waitForElement(() => getByText('Run query'));
    expect(spy).toBeCalledTimes(2);
  });
});
