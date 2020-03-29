import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ResultsTable, { parseDate } from './ResultsTable';

describe('<ResultsTable />', () => {
  test('rendering', async () => {
    const { getAllByText, getByText } = render(
      <ResultsTable
        title="Test title"
        parsedData={[
          { col1: '1', col2: '2', col3: '3', col4: '4' },
          { col1: '111', col2: '112', col3: '113', col4: '114' },
          { col1: '11', col2: '12', col3: '13', col4: '14' },
        ]}
        compactLayout={false}
      />,
    );

    expect(getAllByText('Test title')).toBeDefined();
    expect(getAllByText('col4')).toBeDefined();
    expect(getAllByText('114')).toBeDefined();
    expect(getAllByText('1-3 of 3')).toBeDefined();

    // TODO: sorting test
    // fireEvent.click(getByText('col1'));
    // await wait(() => getByText('21'));
    // fireEvent.click(getByText('col1'));
    // await wait(() => getByText('1'));
    // debug();
    // expect(queryByText('2')).toBeNull();
  });
});

// describe('parseDate()', () => {
//   test('s', () => {
//     const result = parseDate('1544780295000000000', 's');
//     expect(result).toBe('2018-12-14 09:38:15');
//   });
//   test('ms', () => {
//     const result = parseDate('1544780295000000000', 'ms');
//     expect(result).toBe('2018-12-14 09:38:15.000');
//   });
//   test('ns', () => {
//     const result = parseDate('1544780295000000000', 'ns');
//     expect(result).toBe('2018-12-14 09:38:15.000000000');
//   });
//   test('timestamp', () => {
//     const result = parseDate('1544780295000000000', 'timestamp');
//     expect(result).toBe('1544780295000000000');
//   });
// });
