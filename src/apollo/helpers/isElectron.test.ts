import { isElectron } from './isElectron';

test('isElectron()', () => {
  const windowSpy = jest.spyOn(global as any, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    navigator: {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) timeseriesadmin/0.1.4 Chrome/78.0.3904.113 Electron/7.1.2 Safari/537.36',
    },
  }));
  expect(isElectron()).toBe(true);

  windowSpy.mockImplementation(() => ({
    navigator: {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
    },
  }));
  expect(isElectron()).toBe(false);
  windowSpy.mockRestore();
});
