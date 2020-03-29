import React from 'react';
import { render, fireEvent, setupClient, wait } from 'utils/test-utils';

import PanelHistory from './index';
import { QueryHistoryContext } from 'app/contexts/QueryHistoryContext';

const mocks = {
  Mutation: {
    // mutation has to return something
    updateForm: jest.fn(() => null),
  },
};

const queryHistory = [
  {
    query: 'SELECT * FROM test',
  },
  {
    query: 'SELECT field1 FROM test123',
    error: 'some error message',
  },
];

describe('<PanelHistory />', () => {
  test('rendering empty history', async () => {
    const { getByText } = render(
      <QueryHistoryContext.Provider value={{ queryHistory: [] }}>
        <PanelHistory />
      </QueryHistoryContext.Provider>,
      {
        client: setupClient(mocks),
      },
    );

    wait(() => getByText('Query form'));
    expect(
      getByText(
        'List of most recent queries executed, with max length of 300 items.',
      ),
    ).toBeDefined();
    expect(mocks.Mutation.updateForm).toBeCalledTimes(0);
  });

  test('rendering non-empty history', async () => {
    const { getByText, getByLabelText } = render(
      <QueryHistoryContext.Provider value={{ queryHistory }}>
        <PanelHistory />
      </QueryHistoryContext.Provider>,
      {
        client: setupClient(mocks),
      },
    );

    await wait(() => getByText('SELECT * FROM test'));
    expect(getByText('SELECT field1 FROM test123')).toBeDefined();
    fireEvent.click(getByText('SELECT * FROM test'));

    await wait();

    expect(mocks.Mutation.updateForm).toBeCalledTimes(1);
    expect((mocks.Mutation.updateForm.mock.calls[0] as any)[1]).toEqual({
      q: 'SELECT * FROM test',
    });
  });
});
