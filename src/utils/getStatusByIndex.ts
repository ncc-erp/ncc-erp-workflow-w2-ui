import { TaskColors, TaskStatuses, TaskStatusesIndex } from 'common/constants';

export const getStatusByIndex = (statusIndex: number | undefined) => {
  const mappedIndex = statusIndex ? TaskStatusesIndex.indexOf(statusIndex) : 0;

  if (mappedIndex !== -1) {
    const status = TaskStatuses[mappedIndex];
    const color = TaskColors[mappedIndex];
    return { status, color };
  }
  return { status: 'Unknown', color: 'gray' };
};
