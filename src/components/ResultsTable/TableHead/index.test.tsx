import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableHead from './index';

describe('<TableHead />', () => {
  test('rendering and clicking', () => {
    const sortFn = jest.fn();
    const { getByText } = render(
      <table>
        <TableHead
          headers={['first', 'second', 'last']}
          order="asc"
          orderKey="second"
          handleSort={sortFn}
        />
      </table>,
    );
    expect(getByText('first').className.indexOf('active') > -1).toBeFalsy();
    expect(getByText('second').className.indexOf('active') > -1).toBeTruthy();
    expect(getByText('last').className.indexOf('active') > -1).toBeFalsy();
    fireEvent.click(getByText('first'));
    expect(sortFn).toBeCalledTimes(1);
    expect(sortFn).toBeCalledWith('first');
  });
});
