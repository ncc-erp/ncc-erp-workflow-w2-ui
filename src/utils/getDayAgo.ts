import { formatDistanceToNow } from 'date-fns';

export const getDayAgo = (date: string | Date) => {
  const dateAgo = new Date(date);
  const result = formatDistanceToNow(dateAgo, { addSuffix: true });

  return result;
};
