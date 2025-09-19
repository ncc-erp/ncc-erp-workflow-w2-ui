import { TaskStatusesData } from 'common/constants';
import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

export const getTaskStatusesData = (t: TranslationFunction) => [
  { status: t('TASKS_PAGE.TASK_STATUS.PENDING'), color: 'blue' },
  { status: t('TASKS_PAGE.TASK_STATUS.APPROVED'), color: 'green' },
  { status: t('TASKS_PAGE.TASK_STATUS.REJECTED'), color: 'red' },
  { status: t('TASKS_PAGE.TASK_STATUS.FAULTED'), color: 'yellow' },
  { status: t('TASKS_PAGE.TASK_STATUS.CANCELED'), color: 'gray' },
];
export const getStatusByIndex = (
  statusIndex: number | undefined,
  t: TranslationFunction
) => {
  const taskStatusesData = getTaskStatusesData(t);
  const statusData = taskStatusesData[statusIndex as number];

  if (statusData) {
    return { status: statusData.status, color: statusData.color };
  }

  return {
    status: t('TASKS_PAGE.TASK_STATUS.UNKNOWN') || 'Unknown',
    color: 'gray',
  };
};

export const getColorByStatus = (status: string | undefined) => {
  const statusData = TaskStatusesData.find((data) => data.status === status);

  if (statusData) {
    return { status: statusData.status, color: statusData.color };
  }

  return { status: 'Unknown', color: 'gray' };
};
