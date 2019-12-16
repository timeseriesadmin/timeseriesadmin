import React from 'react';
import { render } from 'utils/test-utils';
import Root from './index';

describe('<App />', () => {
  test('rendering empty data', async () => {
    const { getByText, getByLabelText } = render(<Root />);

    expect(getByText('Time Series Admin')).toBeDefined();
    expect(getByLabelText('Close sidebar')).toBeDefined();
  });
});
