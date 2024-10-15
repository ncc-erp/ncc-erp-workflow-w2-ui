import { DEFAULT_FORMAT_DATE } from 'common/constants';
import { format, parse, isValid } from 'date-fns';
import { DateObject } from 'react-multi-date-picker';

type FormParamsValue =
  | string
  | DateObject
  | DateObject[]
  | null
  | Date
  | undefined
  | number;

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

export const formatDateForm = (date: FormParamsValue) => {
  if (date instanceof Date) {
    return formatDate(date, 'dd/MM/yyyy');
  } else {
    let datesFormatted = '';
    datesFormatted += (date as Array<DateObject>)?.map((item: DateObject) => {
      return item.format('DD/MM/YYYY');
    });
    return datesFormatted;
  }
};

export const getFirstLastDayOfCurrentMonth = (
  type: 'first' | 'last',
  currentDate: Date = new Date()
) => {
  const date = new Date(currentDate);
  date.setMonth(
    type === 'first' ? currentDate.getMonth() : currentDate.getMonth() + 1
  );
  date.setDate(type === 'first' ? 1 : 0);
  return formatDate(date, 'dd/MM/yyyy');
};
