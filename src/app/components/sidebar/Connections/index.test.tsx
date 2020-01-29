import React from 'react';
import { render, wait, waitForElement } from 'utils/test-utils';
import Connections, { GET_CONNECTIONS, DELETE_CONNECTION } from './index';

const mocks = (connections: any = []) => [
  {
    request: {
      query: GET_CONNECTIONS,
    },
    result: {
      data: {
        connections,
      },
    },
  },
  {
    request: {
      query: DELETE_CONNECTION,
      variables: { id: 'test' },
    },
    result: {
      data: {
        result: 'ok',
      },
    },
  },
];

describe('<Connections />', () => {
  test('rendering empty data', async () => {
    const { getByText } = render(<Connections />, { mocks: mocks() });

    expect(getByText('Loading...')).toBeDefined();
    await wait();
    await waitForElement(() =>
      getByText(
        'No saved connections. Add one using SAVE CONNECTION DATA button.',
      ),
    );
  });

  test('rendering non-empty data', async () => {
    const connData = [
      {
        id: 'test',
        url: 'http://test.test',
        u: 'user',
        p: 'pass',
        db: 'db',
        unsafeSsl: false,
      },
    ];
    const { getByText, getByLabelText } = render(<Connections />, {
      mocks: mocks(connData),
    });
    await wait();
    await waitForElement(() => getByText(connData[0].url));

    expect(getByText(`database: ${connData[0].db}`)).toBeDefined();
    expect(getByText(`user: ${connData[0].u}`)).toBeDefined();

    expect(getByLabelText('Delete')).toBeDefined();
    // fireEvent.click(getByLabelText('Delete'));
    // TODO: check if DELETE_CONNECTION mutation gets called, there should be some
    // confirmation message displayed after delete operation is completed...
  });
});
