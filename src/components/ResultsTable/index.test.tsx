import React from 'react';
import { render, wait } from 'utils/test-utils';
import ResultsTable, {
  parseDate,
  SET_RESULTS_TABLE,
  GET_RESULTS_TABLE,
} from './index';

const resultsTable = {
  timeFormat: 's',
};

const mocks = [
  {
    request: {
      query: SET_RESULTS_TABLE,
      variables: {},
    },
    result: {
      data: {
        setResultsTable: {
          ...resultsTable,
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
    const { getAllByText } = render(
      <ResultsTable
        title="Test title"
        parsedData={[
          { col_1: '1', col_2: '2', col_3: '3', col_4: '4' },
          { col_1: '111', col_2: '112', col_3: '113', col_4: '114' },
          { col_1: '11', col_2: '12', col_3: '13', col_4: '14' },
        ]}
      />,
      { mocks },
    );

    await wait(); // Mutation
    await wait(); // Query

    expect(getAllByText('Test title')).toBeDefined();
    expect(getAllByText('col_4')).toBeDefined();
    expect(getAllByText('114')).toBeDefined();
    expect(getAllByText('1-3 of 3')).toBeDefined();

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
    expect(result).toBe('2018-12-14 09:38:15');
  });
  test('ms', () => {
    const result = parseDate('1544780295000000000', 'ms');
    expect(result).toBe('2018-12-14 09:38:15.000');
  });
  test('ns', () => {
    const result = parseDate('1544780295000000000', 'ns');
    expect(result).toBe('2018-12-14 09:38:15.000000000');
  });
  test('timestamp', () => {
    const result = parseDate('1544780295000000000', 'timestamp');
    expect(result).toBe('1544780295000000000');
  });
});
