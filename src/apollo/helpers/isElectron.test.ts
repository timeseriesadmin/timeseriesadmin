import { isElectron } from './isElectron';

test('isElectron()', () => {
  const navigator = (global as any).window.navigator;
  delete (global as any).window.navigator;
  (global as any).window.navigator = {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) timeseriesadmin/0.1.4 Chrome/78.0.3904.113 Electron/7.1.2 Safari/537.36',
  };

  expect(isElectron()).toBe(true);

  delete (global as any).window.navigator;
  (global as any).window.navigator = {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
  };
  expect(isElectron()).toBe(false);

  (global as any).window.navigator = navigator;
});
