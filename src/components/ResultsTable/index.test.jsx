import React from 'react';
import { render } from 'test-utils';
import ResultsTable, {
  parseDate,
  sortData,
  SET_RESULTS_TABLE,
  GET_RESULTS_TABLE,
} from './index';

const mocks = [
  {
    request: {
      mutation: SET_RESULTS_TABLE,
    },
  },
  {
    request: {
      query: GET_RESULTS_TABLE,
    },
    result: {
      data: {
        resultsTable: {
          order: 'asc',
          orderBy: 2,
          page: 0,
          rowsPerPage: 5,
          timeFormat: 's',
        },
      },
    },
  },
];

describe('<ResultsTable />', () => {
  test('rendering', async () => {
    const request = { params: { q: 'SELECT * FROM test' } };
    const response = {
      status: 200,
      data: 'col_1,col_2,col_3,col_4\n1,2,3,4\n11,12,13,14',
      statusText: 'Status info',
    };
    const { getByText } = render(
      <ResultsTable
        mocks={mocks}
        queryState={{
          called: true,
          loading: false,
          data: {
            executeQuery: {
              response,
              request,
            },
          },
          error: undefined,
        }}
      />,
    );
    expect(getByText('Executing query please wait...')).toBeDefined();

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(getByText(request.params.q)).toBeDefined();
    expect(getByText('col_4')).toBeDefined();
    expect(getByText('14')).toBeDefined();
    expect(getByText('1-2 of 2')).toBeDefined();
  });
});

describe('parseDate()', () => {
  test('s', () => {
    const result = parseDate('1544780295000000000', 's');
    expect(result).toBe('2018-12-14 10:38:15');
  });
  test('ms', () => {
    const result = parseDate('1544780295000000000', 'ms');
    expect(result).toBe('2018-12-14 10:38:15.000');
  });
  test('ns', () => {
    const result = parseDate('1544780295000000000', 'ns');
    expect(result).toBe('2018-12-14 10:38:15.000000000');
  });
  test('timestamp', () => {
    const result = parseDate('1544780295000000000', 'timestamp');
    expect(result).toBe('1544780295000000000');
  });
});

describe('sortData()', () => {
  test('sort ascending', () => {
    const data = [
      ['11', '12', '13', '14'],
      ['21', '22', '23', '24'],
      ['101', '102', '103', '104'],
      ['1', '1', '1', '1'],
    ];
    const sorted = sortData(data, 'asc', 1);
    expect(sorted[0][1]).toBe('1');
    expect(sorted[3][1]).toBe('102');
  });
  test('sort descending', () => {
    const data = [
      ['11', '12', '13', '14'],
      ['21', '22', '23', '24'],
      ['101', '102', '103', '104'],
      ['1', '1', '1', '1'],
    ];
    const sorted = sortData(data, 'desc', 3);
    expect(sorted[0][1]).toBe('102');
    expect(sorted[3][1]).toBe('1');
  });
  test('handles non-numbers (without an error)', () => {
    const data = [
      [132, '12', '13', '14'],
      [undefined, '22', '23', '24'],
      ['abcdef', '102', '103', '104'],
      [null, '1', '1', '1'],
    ];
    const sorted = sortData(data, 'desc', 0);
    expect(sorted[0][1]).toBe('12');
    expect(sorted[3][1]).toBe('1');
  });
  test('handles no sorting', () => {
    const data = [
      ['101', '102', '103', '104'],
      ['11', '12', '13', '14'],
      ['1', '1', '1', '1'],
      ['21', '22', '23', '24'],
    ];
    const sorted = sortData(data, 'desc', null);
    expect(sorted).toEqual(sorted);
  });
});
