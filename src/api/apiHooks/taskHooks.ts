import {
  FilterTasks,
  StakeHolderResult,
} from './../../models/task';
import {
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

export const useGetAllStakeHolders = (filter: FilterTasks) => {
  return useGetListByPost<StakeHolderResult>(
    [QueryKeys.GET_STAKE_HOLDERS_FOR_FILTER, filter],
    '/app/task/stake-holders',
    filter
  );
};

export const useApproveTask = () => {
  return useUpdateStatus('/app/task', 'approve');
};

export const useRejectTask = () => {
  return useRejectedTask('/app/task');
};
