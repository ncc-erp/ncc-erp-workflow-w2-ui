import { DEFAULT_FORMAT_DATE } from 'common/constants';
import { format } from 'date-fns';

export const formatDate = (
  date: string | Date,
  formatString = DEFAULT_FORMAT_DATE
) => {
  return format(new Date(date), formatString);
};
