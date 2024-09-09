import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_TASK_PER_PAGE, QueryKeys, TaskStatus } from 'common/constants';
import { useCallback } from 'react';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import {
  getAllTask,
  useGetDynamicDataTask,
  useGetList,
  useGetListByPost,
  useRejectedTask,
  useTaskActions,
  useUpdateStatus,
} from '.';
import {
  FilterTasks,
  ITaskResult,
  StakeHolderResult,
  TaskResult,
} from './../../models/task';

export const useGetAllTask = (filter: FilterTasks, status: number) => {
  const getStatus = useCallback(
    (specStatus: number) => {
      const { status } = filter;
      if (status) {
        return Number(status) >= 0
          ? ([Number(status)] as Array<number>)
          : ([specStatus] as Array<number>);
      }
    },
    [filter]
  );
  const filterTask = { ...filter, status: getStatus(status) };
  return useInfiniteQuery({
    queryKey: [QueryKeys.GET_ALL_TASK_FILTERED, filterTask],
    queryFn: ({ pageParam = 0 }) =>
      getAllTask({ ...filterTask, skipCount: pageParam }),
    getNextPageParam: (lastPage, allPage) => {
      const allPageLength = getAllTaskPagination(allPage)?.items?.length;
      return lastPage?.items?.length === DEFAULT_TASK_PER_PAGE &&
        allPageLength < lastPage.totalCount
        ? allPageLength
        : undefined;
    },
  });
};

export const useGetTasks = (filter: FilterTasks) => {
  return useGetListByPost<TaskResult>(
    [QueryKeys.GET_ALL_TASK, filter],
    '/app/task/list',
    {
      ...filter,
      status:
        Number(filter?.status) !== -1
          ? [filter.status]
          : Object.values(TaskStatus),
    },
    {},
    { refetchOnMount: true }
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

export const useDynamicDataTask = () => {
  return useGetDynamicDataTask('/app/task', 'dynamic-data-by-id');
};

export const useRejectTask = () => {
  return useRejectedTask('/app/task');
};

export const useActionTask = () => {
  return useTaskActions();
};

export const useGetTaskDetail = (id: string) => {
  return useGetList<ITaskResult>(
    [QueryKeys.GET_TASK, id],
    `/app/task/${id}/detail-by-id`
  );
};
