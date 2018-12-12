import React from 'react';
import { render } from 'react-testing-library';
import Root from './index';

describe('<Root />', () => {
  test('rendering', () => {
    const { getByText, getByLabelText } = render(<Root />);
    // title
    expect(getByText('Time Series Admin')).toBeDefined();
    // inputs
    expect(getByLabelText('Database URL')).toBeDefined();
    expect(getByLabelText('User')).toBeDefined();
    expect(getByLabelText('Password')).toBeDefined();
    expect(getByLabelText('Database')).toBeDefined();
    expect(getByLabelText('Query')).toBeDefined();
    // panels
    expect(getByText('Connect')).toBeDefined();
    expect(getByText('Explorer')).toBeDefined();
    expect(getByText('History')).toBeDefined();
    expect(getByText('Reference')).toBeDefined();
    // default panel
    expect(getByText('List of all saved connections')).toBeDefined();
  });
});
