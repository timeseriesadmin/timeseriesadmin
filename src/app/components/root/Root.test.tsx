import React from 'react';
import { render, waitForElement } from 'utils/test-utils';
import { Root } from './Root';
import { fireEvent, within } from '@testing-library/react';

describe('<App />', () => {
  test('rendering empty data', async () => {
    const { getByText, getByLabelText, getByTestId } = render(<Root />);

    const sidebar = within(getByTestId('DrawerRight'));
    expect(getByText('Time Series Admin')).toBeDefined();
    expect(getByLabelText('Close sidebar')).toBeDefined();

    fireEvent.click(sidebar.getByText('Connect'));
    expect(getByText(/No saved connections./)).toBeDefined();

    fireEvent.change(getByLabelText('Database URL'), {
      target: { value: 'http://test.test:8086' },
    });
    fireEvent.change(getByLabelText('User'), {
      target: { value: 'test_user' },
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'test_pass' },
    });
    fireEvent.change(getByLabelText('Database'), {
      target: { value: 'test_db' },
    });
    fireEvent.change(getByLabelText('Query'), {
      target: { value: 'test query' },
    });
    fireEvent.click(getByText('Save connection data'));
    await waitForElement(() => getByText('List of all saved connections'));

    expect(sidebar.getByText('http://test.test:8086')).toBeDefined();
    expect(sidebar.getByText('database: test_db')).toBeDefined();
    expect(sidebar.getByText('user: test_user')).toBeDefined();
  });
});
