import { parse } from 'papaparse';

export function parseQueryResults(data: string): any {
  // Influx escapes double quotes with two additional double quotes
  const unescapedData = data.replace(/"""/g, '"');

  const parsed = parse(unescapedData, {
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
