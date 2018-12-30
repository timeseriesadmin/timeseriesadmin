// @flow
import Papa from 'papaparse';

// internal method exported just for tests
export const parseResults = (
  result: string,
  remap: { [string]: string },
  type: string,
) => {
  const response = result.trim();
  if (!response) {
    return null;
  }
  const results = Papa.parse(response, {
    header: true,
  });
  if (results.errors.length > 0) {
    throw new Error(JSON.stringify(results.errors));
  }
  // console.log(results);
  return results.data.map(entry => ({
    __typename: type,
    // TODO: this might be underperformant solution
    ...Object.keys(remap).reduce(
      (acc, key) => ({ ...acc, [key]: entry[remap[key]] }),
      {},
    ),
  }));
};
