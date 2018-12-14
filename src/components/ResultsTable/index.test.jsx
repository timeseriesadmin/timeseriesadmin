import React from 'react';
import { render, fireEvent, waitForElement } from 'test-utils';
import ResultsTable, {
  parseDate,
  sortData,
  parseQueryResults,
  SET_RESULTS_TABLE,
  GET_RESULTS_TABLE,
} from './index';

const resultsTable = {
  order: 'asc',
  orderKey: '',
  page: 0,
  rowsPerPage: 2,
  timeFormat: 's',
};

const mocks = [
  {
    request: {
      query: SET_RESULTS_TABLE,
      variables: { order: 'desc', orderKey: 'col_1' },
    },
    result: {
      data: {
        setResultsTable: {
          ...resultsTable,
          order: 'desc',
          orderKey: 'col_1',
        },
      },
    },
  },
  {
    request: {
      query: GET_RESULTS_TABLE,
    },
    result: {
      data: {
        resultsTable,
      },
    },
  },
];

describe('<ResultsTable />', () => {
  test('rendering', async () => {
    const request = { params: { q: 'SELECT * FROM test' } };
    const response = {
      status: 200,
      data: 'col_1,col_2,col_3,col_4\n11,12,13,14\n21,22,23,24\n1,2,3,4\n',
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
    expect(getByText('1-2 of 3')).toBeDefined();

    // TODO: ensure that sort is working
    // (there is a problem with checking if apollo mock gets called)
    // sorting
    // fireEvent.click(getByText('col_1'));
    // await waitForElement(() => getByText('21'));
    // fireEvent.click(getByText('col_1'));
    // await waitForElement(() => getByText('1'));
    // debug();
    // expect(queryByText('2')).toBeNull();
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
  let data;
  beforeAll(() => {
    data = [
      { n: 'test', time: '0.123123' },
      { n: 'test', time: '123123123' },
      { n: 'test', time: '-0.123123' },
      { n: 'test', time: '' },
    ];
  });
  test('sort ascending', () => {
    const sorted = sortData(data, 'asc', 'time');
    expect(sorted).toEqual([
      { n: 'test', time: '' },
      { n: 'test', time: '-0.123123' },
      { n: 'test', time: '0.123123' },
      { n: 'test', time: '123123123' },
    ]);
  });
  test('sort descending', () => {
    const sorted = sortData(data, 'desc', 'time');
    expect(sorted).toEqual([
      { n: 'test', time: '123123123' },
      { n: 'test', time: '0.123123' },
      { n: 'test', time: '-0.123123' },
      { n: 'test', time: '' },
    ]);
  });
  test('handles edge cases without an error', () => {
    const input = [
      { n: 'test', time: Number.NaN },
      { n: 'test', time: '' },
      { n: 'test', time: null },
      { n: 'test', time: undefined },
    ];
    const sorted = sortData(input, 'desc', 'time');
    expect(sorted).toEqual([
      { n: 'test', time: Number.NaN },
      { n: 'test', time: undefined },
      { n: 'test', time: null },
      { n: 'test', time: '' },
    ]);
  });
  test('handles no sorting', () => {
    const input = [
      { n: '123', b: '789' },
      { n: '5123', b: '1789' },
      { n: '1', b: '1' },
    ];
    const sorted = sortData(input, 'desc', '');
    expect(sorted).toEqual(input);
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
