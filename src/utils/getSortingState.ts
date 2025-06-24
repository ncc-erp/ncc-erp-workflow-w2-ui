import { SortingState } from '@tanstack/react-table';

export const getSortingState = (
  sorting: string,
  initialSorting: SortingState
) => {
  const paramsSorting = sorting ? sorting.split(' ') : [];
  const { id, desc } =
    paramsSorting.length > 0
      ? { id: paramsSorting[0], desc: paramsSorting[1] === 'desc' }
      : initialSorting[0];
  return [{ id, desc }];
};
