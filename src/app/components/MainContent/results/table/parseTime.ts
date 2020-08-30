import { TimeFormat } from 'app/contexts/SettingsContext';

export const parseTime = (date: string, timeFormat: TimeFormat): string => {
  const paddedTimestamp = date.padStart(7, '0');
  const isoDate = new Date(
    parseInt(paddedTimestamp.slice(0, -6), 10),
  ).toISOString();

  switch (timeFormat) {
    case 's':
      return isoDate.slice(0, -5) + 'Z';
    case 'ms':
      return isoDate;
    case 'ns':
      return isoDate.slice(0, -1) + paddedTimestamp.slice(-6) + 'Z';
    default:
      return `${parseInt(paddedTimestamp, 10)}`;
  }
};
