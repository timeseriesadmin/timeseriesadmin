import React from 'react';
import { render, waitForElement, fireEvent } from 'test-utils';
import Connections, { GET_CONNECTIONS } from './index';

const mocks = (connections = []) => [
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
];

describe('<Connections />', () => {
  test('rendering empty data', async () => {
    const { getByText } = render(<Connections mocks={mocks()} />);

    expect(getByText('Loading...')).toBeDefined();
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
      },
    ];
    const { getByText, getByLabelText } = render(
      <Connections mocks={mocks(connData)} />,
    );

    await waitForElement(() => getByText(connData[0].url));
    expect(getByText(connData[0].url)).toBeDefined();
    expect(getByText(`database: ${connData[0].db}`)).toBeDefined();
    expect(getByText(`user: ${connData[0].u}`)).toBeDefined();

    fireEvent.click(getByLabelText('Delete'));
    // TODO: check if DELETE_CONNECTION mutation gets called, there should be some
    // confirmation message displayed after delete operation is completed...
  });
});
