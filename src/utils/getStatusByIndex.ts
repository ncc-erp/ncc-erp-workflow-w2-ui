import { TaskStatusesData } from 'common/constants';

export const getStatusByIndex = (statusIndex: number | undefined) => {
  const statusData = TaskStatusesData[statusIndex as number];

  if (statusData) {
    return { status: statusData.status, color: statusData.color };
  }

  return { status: 'Unknown', color: 'gray' };
};
