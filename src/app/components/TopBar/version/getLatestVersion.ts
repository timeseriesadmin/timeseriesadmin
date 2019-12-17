import axios from 'axios';

const REPO_PATH = 'timeseriesadmin/timeseriesadmin';
export const API_LATEST_RELEASE_URL = `https://api.github.com/repos/${REPO_PATH}/releases/latest`;
export const LATEST_RELEASE_URL = `https://timeseriesadmin.github.io/#download`;

export async function getLatestVersion() {
  const response = await axios.get(API_LATEST_RELEASE_URL, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  if (!response || !response.data || !response.data.tag_name) {
    // const err = new Error('Unsupported API response');
    // err.details = response;
    throw new Error('Unsupported API response');
  }

  return response.data.tag_name;
}
