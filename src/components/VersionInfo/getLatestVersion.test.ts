import axios from 'axios';
import { getLatestVersion } from './getLatestVersion';
jest.mock('axios');

describe('github resolvers', () => {
  test('successful API reponse', async () => {
    (axios as any).get.mockReturnValueOnce({
      data: { tag_name: 'v0.1.1' },
    });
    const ver = await getLatestVersion();
    expect(ver).toBe('v0.1.1');
  });
  test('unsupported API reponse', async () => {
    (axios as any).get.mockReturnValueOnce('');
    await expect(getLatestVersion()).rejects.toThrow(
      'Unsupported API response',
    );
  });
});
