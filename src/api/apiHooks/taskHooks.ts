import { DEFAULT_TASK_PER_PAGE, QueryKeys } from 'common/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllTaskPagination } from 'utils/getAllTaskPagination';
import { FilterTasks, ITaskResult } from './../../models/task';
import { useGetList, useRejectedTask, useUpdateStatus, getAllTask } from '.';

export const useGetAllTask = (filter: FilterTasks) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GET_ALL_TASK, filter],
    queryFn: ({ pageParam = 0 }) =>
      getAllTask({ ...filter, skipCount: pageParam }),
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

export const useGetTaskDetail = (id: string) => {
  return useGetList<ITaskResult>(
    [QueryKeys.GET_TASK, id],
    `/app/task/${id}/detail-by-id`
  );
};
