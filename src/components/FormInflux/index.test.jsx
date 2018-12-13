import React from 'react';
import { render, waitForElement } from 'test-utils';

// The component AND the query need to be exported
import FormInflux, { GET_INITIAL, SAVE_CONNECTION } from './index';

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
        },
      },
    },
  },
  {
    request: {
      mutation: SAVE_CONNECTION,
    },
  },
];

describe('<FormInflux />', () => {
  test('rendering', async () => {
    const spy = jest.fn();
    const { getByText, getByLabelText } = render(
      <FormInflux mocks={mocks} onSubmit={spy} />,
    );
    expect(getByText('Loading data...')).toBeDefined();

    await waitForElement(() => getByText('Run query'));

    expect(getByLabelText('Database URL').value).toBe('http://test.test:8086');
    expect(getByLabelText('User').value).toBe('test_user');
    expect(getByLabelText('Password').value).toBe('test_pass');
    expect(getByLabelText('Database').value).toBe('test_db');
    expect(getByLabelText('Query').value).toBe('test query');

    // TODO: fix tests, spy is not called after form submission

    // fireEvent.click(getByText('Run query'));
    // await waitForElement(() => getByText('Executing query...'));
    // expect(spy).toBeCalledTimes(1);
    // expect(spy).toBeCalledWith('');
  });
});
