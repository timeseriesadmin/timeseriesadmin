import { isVersionOutdated } from './isVersionOutdated';
import '../../../config';
jest.mock('../../../config', () => ({
  CURRENT_VERSION: '0.1.1',
}));

test('isVersionOutdated()', () => {
  expect(isVersionOutdated('v0.1.2')).toBe(true);
  expect(isVersionOutdated('v0.2.1')).toBe(true);
  expect(isVersionOutdated('v1.1.0')).toBe(true);

  expect(isVersionOutdated('v0.1.0')).toBe(false);
  expect(isVersionOutdated('v0.0.1')).toBe(false);
});
