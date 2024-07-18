import { DEFAULT_FORMAT_DATE } from 'common/constants';
import { format, parse, isValid, parseISO } from 'date-fns';

export const isValidDate = (
  date: string,
  formatString = DEFAULT_FORMAT_DATE
) => {
  return isValid(parse(date, formatString, new Date()));
};

export const parseDateStrings = (dateStrings: string) => {
  const validDates: string[] = [];
  const invalidDates: string[] = [];

  dateStrings?.split(',').forEach((dateString) => {
    const trimmedDate = dateString.trim();
    if (isValidDate(trimmedDate, 'dd/MM/yyyy')) {
      validDates.push(trimmedDate);
    } else if (isValidDate(trimmedDate, 'yyyy/MM/dd')) {
      validDates.push(
        formatDate(parse(trimmedDate, 'yyyy/MM/dd', new Date()), 'dd/MM/yyyy')
      );
    } else {
      invalidDates.push(trimmedDate);
    }
  });

  if (invalidDates.length === 0) {
    return validDates;
  }
  return undefined;
};

export const formatDate = (
  date: string | Date,
  formatString = DEFAULT_FORMAT_DATE
) => {
  return format(new Date(date), formatString);
};

/**
 * Formats a date or string to the format "19 June 2024".
 * @param date The date or date string to format.
 * @returns A string formatted as "19 June 2024".
 */
export function formatDateTask(date: Date | string): string {
  // If the input is a string, parse it to a Date object.
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  // Format the date to the desired format.
  return format(dateObj, 'd MMMM yyyy');
}
