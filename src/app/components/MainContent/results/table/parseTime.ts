import format from 'date-fns/format';
import { SettingsContext } from 'app/contexts/SettingsContext';

const tzOffset = new Date().getTimezoneOffset();

export const parseTime = (
  date: string,
  timeFormat: SettingsContext['timeFormat'],
): string => {
  const ts = parseInt(date.slice(0, -6), 10) + tzOffset * 60 * 1000;
  switch (timeFormat) {
    case 's':
      return format(ts, 'yyyy-MM-dd HH:mm:ss');
    case 'ms':
      return format(ts, 'yyyy-MM-dd HH:mm:ss.SSS');
    case 'ns':
      return format(ts, 'yyyy-MM-dd HH:mm:ss.SSS') + date.slice(-6);
    default:
      return date;
  }
};
