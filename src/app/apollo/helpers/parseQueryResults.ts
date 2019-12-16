import { parse } from 'papaparse';

export function parseQueryResults(data: string): any {
  const parsed = parse(data, {
    header: true,
    skipEmptyLines: 'greedy', // skip empty and whitespace lines
  });
  if (!data) {
    // probably no data returned from API
    return undefined;
  }
  if (parsed.errors && parsed.errors.length > 0) {
    // console.error(parsed.errors);
    return parsed.data;
  }
  if (parsed.data) {
    return parsed.data;
  }
}
