import React from 'react';
import { render } from '@testing-library/react';
import Results from './Results';
import ResultsTable from './table/ResultsTable';
jest.mock('./table/ResultsTable', () => jest.fn(() => <div />));

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

describe('<Results />', () => {
  test('rendering', () => {
    render(
      <Results
        results={{
          response: { data: [{ a: '1', b: '2', c: '3' }] },
          request: { params: { q: 'SELECT * FROM test' } },
        }}
        loading={false}
        error={false}
      />,
    );
    expect(ResultsTable).toBeCalledTimes(1);
    expect((ResultsTable as any).mock.calls[0][0]).toEqual({
      compactLayout: false,
      parsedData: [{ a: '1', b: '2', c: '3' }],
      title: query.executeQuery.request.params.q,
    });
  });
  test('rendering loading state', () => {
    const { getByText } = render(<Results loading={true} />);
    expect(getByText('Executing query please wait...')).toBeDefined();
  });
  test('rendering error state', () => {
    const { getByText } = render(
      <Results
        error={{
          title: '501: Problem',
          details:
            '{"status":"501","statusText":"Problem","details":"Some details","networkError":{"details":"error info"}}',
        }}
        loading={true}
      />,
    );
    expect(getByText('Error details')).toBeDefined();
    expect(
      getByText(
        '"{"status":"501","statusText":"Problem","details":"Some details","networkError":{"details":"error info"}}"',
      ),
    ).toBeDefined();
  });
  test('rendering ready state', () => {
    const { getByText } = render(
      <Results loading={false} results={undefined} error={false} />,
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
      <Results
        results={{ response: { data: [], status: 200, statusText: 'No data' } }}
        loading={false}
      />,
    );
    expect(getByText('200: No data')).toBeDefined();
    expect(
      getByText(
        'Please verify your query if this is not the expected response.',
      ),
    ).toBeDefined();
  });
});
