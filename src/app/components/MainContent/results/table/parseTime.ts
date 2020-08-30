import format from 'date-fns/format';
import { TimeFormat } from 'app/contexts/SettingsContext';

const currentDate = new Date();

export const parseTime = (date: string, timeFormat: TimeFormat): string => {
  const tzOffset = currentDate.getTimezoneOffset();

  const paddedTimestamp = date.padStart(7, '0');
  const timestampNumber =
    parseInt(paddedTimestamp.slice(0, -6), 10) + tzOffset * 60 * 1000;

  switch (timeFormat) {
    case 's':
      return format(timestampNumber, 'yyyy-MM-dd HH:mm:ss');
    case 'ms':
      return format(timestampNumber, 'yyyy-MM-dd HH:mm:ss.SSS');
    case 'ns':
      return (
        format(timestampNumber, 'yyyy-MM-dd HH:mm:ss.SSS') +
        paddedTimestamp.slice(-6)
      );
    default:
      return `${timestampNumber}`;
  }
};
