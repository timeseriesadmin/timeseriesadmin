import isElectron from './isElectron';

describe('isElectron', () => {
  let userAgent;

  beforeAll(() => {
    userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
  });
  test('returns true for Electron runtime', () => {
    userAgent.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) timeseriesadmin/0.1.4 Chrome/76.0.3809.139 Electron/6.0.7 Safari/537.36',
    );
    expect(isElectron()).toBe(true);
  });
  test('returns false for browser runtime', () => {
    userAgent.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
    );
    expect(isElectron()).toBe(false);
  });
});
