import React from 'react';
import { render, wait } from 'utils/test-utils';
import VersionInfo from './index';
import { getLatestVersion } from './getLatestVersion';
jest.mock('./getLatestVersion');
import '../../config';
jest.mock('../../config', () => ({
  CURRENT_VERSION: '0.1.1',
}));

describe('<VersionInfo />', () => {
  test('rendering without new version', async () => {
    (getLatestVersion as jest.Mock<any>).mockImplementation(() =>
      Promise.resolve('v0.1.1'),
    );
    const { getByText, queryByText } = render(<VersionInfo />);
    await wait();

    expect(getByText('ver.')).toBeDefined();
    expect(getByText('0.1.1')).toBeDefined();
    expect(queryByText('New version available')).toBeNull();
  });

  test('rendering new version button', async () => {
    (getLatestVersion as jest.Mock<any>).mockImplementation(() =>
      Promise.resolve('v0.1.9'),
    );
    const { getByText } = render(<VersionInfo />);
    await wait();

    expect(getByText('ver.')).toBeDefined();
    expect(getByText('New version available')).toBeDefined();
  });

  test('error handling', async () => {
    (getLatestVersion as jest.Mock<any>).mockImplementation(() =>
      Promise.reject('Unsupported API response'),
    );
    const { getByText } = render(<VersionInfo />);
    await wait();

    expect(getByText('ver.')).toBeDefined();
    expect(getByText('0.1.1')).toBeDefined();
  });
});
