import React from 'react';
import { render } from '@testing-library/react';
import QueryResults, { parseQueryResults } from './index';
import ResultsTable from '../ResultsTable';
jest.mock('../ResultsTable', () => jest.fn(() => <div />));

const query = {
  executeQuery: {
    request: {
      params: { q: 'SELECT * FROM test' },
    },
    response: {
      data: 'a,b,c\n1,2,3',
      status: 200,
    },
  },
};

describe('<QueryResults />', () => {
  test('rendering', () => {
    render(<QueryResults called={true} loading={false} query={query} />);
    expect(ResultsTable).toBeCalledTimes(1);
    expect((ResultsTable as any).mock.calls[0][0]).toEqual({
      parsedData: [{ a: '1', b: '2', c: '3' }],
      title: query.executeQuery.request.params.q,
    });
  });
  test('rendering loading state', () => {
    const { getByText } = render(
      <QueryResults query={query} called={true} loading={true} />,
    );
    expect(getByText('Executing query please wait...')).toBeDefined();
  });
  test('rendering error state', () => {
    const { getByText } = render(
      <QueryResults
        query={query}
        error={{
          status: '501',
          statusText: 'Problem',
          details: 'Some details',
          networkError: { details: 'error info' },
        }}
        called={true}
        loading={true}
      />,
    );
    expect(getByText('Error details')).toBeDefined();
    expect(
      getByText(
        '{"status":"501","statusText":"Problem","details":"Some details","networkError":{"details":"error info"}}',
      ),
    ).toBeDefined();
  });
  test('rendering loading state', () => {
    const { getByText } = render(
      <QueryResults query={query} called={false} loading={true} />,
    );
    expect(getByText('Go ahead and "RUN QUERY"!')).toBeDefined();
  });
  test('rendering empty response state', () => {
    const emptyQuery = {
      executeQuery: {
        response: {
          ...query.executeQuery.response,
          data: '',
        },
      },
    };
    const { getByText } = render(
      <QueryResults called={true} loading={false} query={emptyQuery} />,
    );
    expect(getByText('200: No data')).toBeDefined();
    expect(
      getByText(
        'Please verify your query if this is not the expected response.',
      ),
    ).toBeDefined();
  });
});

describe('parseQueryResults()', () => {
  test('sample string parsing', () => {
    const result = parseQueryResults(
      'col_1,col_2,col_3,col_4\n1,2,3,4\n11,12,13,14',
    );
    expect(result.data).toEqual([
      { col_1: '1', col_2: '2', col_3: '3', col_4: '4' },
      { col_1: '11', col_2: '12', col_3: '13', col_4: '14' },
    ]);
  });
});
