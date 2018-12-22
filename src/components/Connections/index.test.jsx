import React from 'react';
import { render, waitForElement } from 'test-utils';
import Connections, { GET_CONNECTIONS } from './index';

const mocks = [
  {
    request: {
      query: GET_CONNECTIONS,
    },
    result: {
      data: {
        connections: [
          // { id: 'test', url: 'test', u: 'user', p: 'pass', db: 'db' },
        ],
      },
    },
  },
];

describe('<Connections />', () => {
  test('rendering', async () => {
    const { getByText } = render(<Connections mocks={mocks} />);

    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() =>
      getByText(
        'No saved connections. Add one using SAVE CONNECTION DATA button.',
      ),
    );
  });
});
