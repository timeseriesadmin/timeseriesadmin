import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DrawerRight from './index';

import PanelExplorer from '../PanelExplorer';
import PanelHistory from '../PanelHistory';
import PanelReference from '../PanelReference';
import PanelConnect from '../PanelConnect';
jest.mock('../PanelExplorer');
jest.mock('../PanelHistory');
jest.mock('../PanelReference');
jest.mock('../PanelConnect');

describe('<DrawerRight />', () => {
  test('rendering', () => {
    render(<DrawerRight drawerWidth={500} />);

    expect(PanelConnect).toBeCalledTimes(1);
  });

  test('tab switching', () => {
    (PanelConnect as any).mockClear();
    (PanelExplorer as any).mockClear();
    (PanelReference as any).mockClear();
    (PanelHistory as any).mockClear();

    const { getByText } = render(<DrawerRight drawerWidth={500} />);

    fireEvent.click(getByText('Explorer'));
    expect(PanelExplorer).toBeCalledTimes(1);

    fireEvent.click(getByText('History'));
    expect(PanelHistory).toBeCalledTimes(1);

    fireEvent.click(getByText('Reference'));
    expect(PanelReference).toBeCalledTimes(1);

    fireEvent.click(getByText('Connect'));
    expect(PanelConnect).toBeCalledTimes(2);
  });
});
