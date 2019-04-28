import React from 'react';
import { render } from 'test-utils';
import ResultsTable, {
  parseDate,
  sortData,
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
    const { getByText } = render(
      <ResultsTable
        mocks={mocks}
        title="Test title"
        parsedData={[
          { col_1: '1', col_2: '2', col_3: '3', col_4: '4' },
          { col_1: '111', col_2: '112', col_3: '113', col_4: '114' },
          { col_1: '11', col_2: '12', col_3: '13', col_4: '14' },
        ]}
      />,
    );

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(getByText('Test title')).toBeDefined();
    expect(getByText('col_4')).toBeDefined();
    expect(getByText('114')).toBeDefined();
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
    expect(result).toBe('2018-12-14 08:38:15');
  });
  test('ms', () => {
    const result = parseDate('1544780295000000000', 'ms');
    expect(result).toBe('2018-12-14 08:38:15.000');
  });
  test('ns', () => {
    const result = parseDate('1544780295000000000', 'ns');
    expect(result).toBe('2018-12-14 08:38:15.000000000');
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
      { n: 'test', time: '9' },
      { n: 'test', time: '100' },
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
      { n: 'test', time: '9' },
      { n: 'test', time: '100' },
    ]);
  });
  test('sort descending', () => {
    const sorted = sortData(data, 'desc', 'time');
    expect(sorted).toEqual([
      { n: 'test', time: '100' },
      { n: 'test', time: '9' },
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
    // exact order doesn't matter, just make sure that there are no errors
    expect(sorted.length).toBe(4);
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
