import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'common/constants';

export function useClearCacheTask() {
  const queryClient = useQueryClient();

  const queryKeysToRemove = [
    QueryKeys.GET_ALL_TASK,
    QueryKeys.FILTER_REQUEST,
    QueryKeys.GET_WFH_LIST,
  ];
  const clear = () => {
    queryKeysToRemove.forEach((key) => {
      queryClient.removeQueries({ queryKey: [key] });
    });
  };

  return { clear };
}
