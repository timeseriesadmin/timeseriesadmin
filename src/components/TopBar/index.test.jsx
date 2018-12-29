import React from 'react';
import { render, fireEvent } from 'test-utils';
import TopBar from './index';
import VersionInfo from '../VersionInfo';
jest.mock('../VersionInfo');

describe('<TopBar />', () => {
  test('rendering and opening sidebar', async () => {
    const toggleDrawer = jest.fn();
    const { getByText, getByLabelText } = render(
      <TopBar isOpenDrawer={false} toggleDrawer={toggleDrawer} />,
    );
    expect(VersionInfo).toBeCalledTimes(1);
    expect(toggleDrawer).toBeCalledTimes(0);
    expect(getByText('Time Series Admin')).toBeDefined();

    fireEvent.click(getByLabelText('Open sidebar'));
    expect(toggleDrawer).toBeCalledTimes(1);
  });
  test('closing sidebar', async () => {
    const toggleDrawer = jest.fn();
    const { getByLabelText } = render(
      <TopBar isOpenDrawer={true} toggleDrawer={toggleDrawer} />,
    );
    fireEvent.click(getByLabelText('Close sidebar'));
    expect(toggleDrawer).toBeCalledTimes(1);
  });
});
