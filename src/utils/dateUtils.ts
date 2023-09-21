import { DEFAULT_FORMAT_DATE } from 'common/constants';
import { format, parse, isValid } from 'date-fns';

export const isValidDate = (
  date: string,
  formatString = DEFAULT_FORMAT_DATE
) => {
  return isValid(parse(date, formatString, new Date()));
};

export const parseDateStrings = (dateStrings: string) => {
  const validDates: string[] = [];
  const invalidDates: string[] = [];

  dateStrings.split(',').forEach((dateString) => {
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
