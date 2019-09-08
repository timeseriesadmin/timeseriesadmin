import React from 'react';
import {
  render,
  fireEvent,
  setupClient,
  waitForElement,
  wait,
} from 'test-utils';

import PanelHistory from './index';

const mocks = (queryHistory = []) => ({
  Query: {
    queryHistory: () => queryHistory,
  },
  Mutation: {
    // mutation has to return something
    updateForm: jest.fn(() => null),
  },
});

describe('<PanelHistory />', () => {
  test('rendering empty history', async () => {
    const { getByText } = render(
      <PanelHistory client={setupClient(mocks())} />,
    );
    expect(getByText('Query form')).toBeDefined();
    expect(
      getByText(
        'List of most recent queries executed, with max length of 300 items.',
      ),
    ).toBeDefined();
  });

  test('rendering non-empty history', async () => {
    const mockedResolvers = mocks([
      {
        __typename: 'InfluxQuery',
        query: 'SELECT * FROM test',
        error: null,
      },
      {
        __typename: 'InfluxQuery',
        query: 'SELECT field1 FROM test123',
        error: 'some error message',
      },
    ]);
    const { getByText, getByLabelText } = render(
      <PanelHistory client={setupClient(mockedResolvers)} />,
    );

    await waitForElement(() => getByText('SELECT * FROM test'));
    expect(getByLabelText('Invalid query')).toBeDefined();

    fireEvent.click(getByText('SELECT * FROM test'));
    await wait();
    expect(mockedResolvers.Mutation.updateForm).toBeCalledTimes(1);
    expect(mockedResolvers.Mutation.updateForm.mock.calls[0][1]).toEqual({
      q: 'SELECT * FROM test',
    });
  });
});
