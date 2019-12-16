import compareVersions from 'compare-versions';
import { CURRENT_VERSION } from '../../../config';

export function isVersionOutdated(version: string): boolean {
  return compareVersions(version, CURRENT_VERSION) > 0;
}
