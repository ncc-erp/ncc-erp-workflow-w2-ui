import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_TASK_PER_PAGE, QueryKeys } from 'common/constants';
import { useCallback } from 'react';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import {
  getAllTask,
  useGetList,
  useRejectedTask,
  useTaskActions,
  useUpdateStatus,
} from '.';
import { FilterTasks, ITaskResult } from './../../models/task';

export const useGetAllTask = (filter: FilterTasks, status: number) => {
  const getStatus = useCallback(
    (specStatus: number) => {
      const { status } = filter;
      if (status) {
        return status >= 0 ? status : specStatus;
      }
    },
    [filter]
  );
  const filterTask = { ...filter, status: getStatus(status) };
  return useInfiniteQuery({
    queryKey: [QueryKeys.GET_ALL_TASK, filterTask],
    queryFn: ({ pageParam = 0 }) =>
      getAllTask({ ...filterTask, skipCount: pageParam }),
    getNextPageParam: (lastPage, allPage) => {
      return lastPage?.items?.length === DEFAULT_TASK_PER_PAGE
        ? getAllTaskPagination(allPage)?.items?.length
        : undefined;
    },
  });
};

export const useApproveTask = () => {
  return useUpdateStatus('/app/task', 'approve');
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
