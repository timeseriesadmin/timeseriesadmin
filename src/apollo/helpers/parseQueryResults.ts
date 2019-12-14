import { parse } from 'papaparse';

export function parseQueryResults(data: string): any {
  const parsed = parse(data, {
    header: true,
    skipEmptyLines: 'greedy', // skip empty and whitespace lines
  });
  if (parsed.errors && parsed.errors.length > 0) {
    console.error(parsed.errors);
  }
  if (parsed.data) {
    return parsed.data;
  }
}
