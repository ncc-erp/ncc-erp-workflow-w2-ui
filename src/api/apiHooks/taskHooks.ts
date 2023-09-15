import { FilterTasks } from './../../models/task';
import { useGetListByPost, useRejectedTask, useUpdateStatus } from '.';
import { QueryKeys } from 'common/constants';
import { TaskResult } from 'models/task';

export const useGetAllTask = (filter: FilterTasks) => {
  return useGetListByPost<TaskResult>(
    [QueryKeys.GET_ALL_TASK, filter],
    '/app/task/list',
    filter
  );
};

export const useCancelTask = () => {
  return useUpdateStatus('/app/task', 'cancel');
};

export const useApproveTask = () => {
  return useUpdateStatus('/app/task', 'approve');
};

export const useRejectTask = () => {
  return useRejectedTask('/app/task');
};
