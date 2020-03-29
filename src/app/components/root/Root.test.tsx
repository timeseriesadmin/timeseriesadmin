import React from 'react';
import { render, wait } from 'utils/test-utils';
import { Root } from './Root';
import { fireEvent, within } from '@testing-library/react';

jest.mock('app/helpers/queryBase', () => ({
  queryBase: jest.fn().mockResolvedValue({ response: { status: 200 } }),
}));

describe('<App />', () => {
  test('connection and query history saving', async () => {
    const { getByText, getByLabelText, getByTestId } = render(<Root />);
    const sidebar = within(getByTestId('DrawerRight'));

    // given opened connections
    fireEvent.click(sidebar.getByText('Connect'));
    expect(getByText(/No saved connections./)).toBeDefined();

    // when fill data
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

    // then
    await wait(() => getByText('List of all saved connections'));

    expect(sidebar.getByText('http://test.test:8086')).toBeDefined();
    expect(sidebar.getByText('database: test_db')).toBeDefined();
    expect(sidebar.getByText('user: test_user')).toBeDefined();

    // given form submit
    fireEvent.submit(getByText('Run query'));

    // when on history
    fireEvent.click(sidebar.getByText('History'));

    // then
    await wait(() => sidebar.getByText('test query'));
  });
});
