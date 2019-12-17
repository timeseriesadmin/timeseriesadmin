import React from 'react';
import { render, fireEvent } from 'utils/test-utils';
import TopBar from './index';
import { VersionInfo } from './version/VersionInfo';
jest.mock('./version/VersionInfo');

(VersionInfo as jest.Mock<any>).mockReturnValue(<div></div>);

describe('<TopBar />', () => {
  test('rendering and opening sidebar', async () => {
    const toggleDrawer = jest.fn();
    const { getByText, getByLabelText } = await render(
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
    const { getByLabelText } = await render(
      <TopBar isOpenDrawer={true} toggleDrawer={toggleDrawer} />,
    );
    fireEvent.click(getByLabelText('Close sidebar'));
    expect(toggleDrawer).toBeCalledTimes(1);
  });
});
