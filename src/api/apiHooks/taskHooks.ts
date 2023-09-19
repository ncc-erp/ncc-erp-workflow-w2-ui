import { FilterTasks, ITaskResult } from './../../models/task';
import {
  useGetList,
  useGetListByPost,
  useRejectedTask,
  useUpdateStatus,
} from '.';
import { QueryKeys } from 'common/constants';
import { TaskResult } from 'models/task';

export const useGetAllTask = (filter: FilterTasks) => {
  return useGetListByPost<TaskResult>(
    [QueryKeys.GET_ALL_TASK, filter],
    '/app/task/list',
    filter
  );
};

export const useApproveTask = () => {
  return useUpdateStatus('/app/task', 'approve');
};

export const useRejectTask = () => {
  return useRejectedTask('/app/task');
};

export const useGetTaskDetail = (id: string) => {
  return useGetList<ITaskResult>(
    [QueryKeys.GET_TASK, id],
    `/app/task/${id}/detail-by-id`
  );
};
