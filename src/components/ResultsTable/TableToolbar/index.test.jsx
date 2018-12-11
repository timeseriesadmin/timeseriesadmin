import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import TableToolbar from './index';

describe('TableToolbar', () => {
  test('rendering', () => {
    const spy = jest.fn();
    const { getByText } = render(
      <TableToolbar
        title="Toolbar title"
        timeFormat="ns"
        handleFormatChange={spy}
        hasTime
      />,
    );
    expect(getByText('Toolbar title')).toBeDefined();
    // open menu
    fireEvent.click(getByText('Date with nanoseconds'));
    expect(getByText('Timestamp')).toBeDefined();
    expect(getByText('Date with seconds')).toBeDefined();
    expect(getByText('Date with milliseconds')).toBeDefined();
    expect(getByText('Date with nanoseconds')).toBeDefined();
    // select one menu item
    fireEvent.click(getByText('Date with seconds'));
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0][0].target.value).toBe('s');
  });

  test('rendering without time select', () => {
    const spy = jest.fn();
    const { queryByText, getByText } = render(
      <TableToolbar
        title="Toolbar title"
        timeFormat="ns"
        handleFormatChange={spy}
        hasTime={false}
      />,
    );
    expect(getByText('Toolbar title')).toBeDefined();
    expect(queryByText('Timestamp')).toBeNull();
  });
});
