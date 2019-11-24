import React from 'react';
import { render, waitForElement, act, wait } from 'utils/test-utils';
import VersionInfo, { versionIsUpToDate, GET_LATEST_VERSION } from './index';
import '../../config';
jest.mock('../../config', () => ({
  CURRENT_VERSION: '0.1.1',
}));

const mocks = (version = 'v0.1.1') => [
  {
    request: {
      query: GET_LATEST_VERSION,
    },
    result: {
      data: {
        getLatestVersion: version,
      },
    },
  },
];

describe('<VersionInfo />', () => {
  test('versionIsUpToDate()', () => {
    expect(versionIsUpToDate('v0.1.2')).toBe(false);
    expect(versionIsUpToDate('v0.2.1')).toBe(false);
    expect(versionIsUpToDate('v1.1.0')).toBe(false);

    expect(versionIsUpToDate('v0.1.0')).toBe(true);
    expect(versionIsUpToDate('v0.0.1')).toBe(true);
  });

  test('rendering without new version', async () => {
    const { getByText, queryByText } = render(<VersionInfo />, {
      mocks: mocks('v0.1.1'),
    });

    await wait();

    expect(getByText('ver.')).toBeDefined();
    expect(queryByText('New version available')).toBeNull();
  });

  test('rendering new version button', async () => {
    const { getByText } = render(<VersionInfo />, {
      mocks: mocks('v0.1.2'),
    });

    await wait();

    expect(getByText('ver.')).toBeDefined();
    expect(getByText('New version available')).toBeDefined();
  });

  // TODO:
  // test('error handling', async () => {
  // });
});
