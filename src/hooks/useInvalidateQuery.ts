import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FilterWfhResult } from 'models/report';
import { FilterRequestResult, RequestTemplateResult } from 'models/request';
import { ITaskResponse } from 'models/task';
import { FilterUserResult } from 'models/userIdentity';

interface IParams {
  data:
    | RequestTemplateResult
    | FilterRequestResult
    | InfiniteData<ITaskResponse>
    | FilterUserResult
    | FilterWfhResult
    | undefined;
  queryKeys: string;
}

export const useInvalidateQuery = ({ data, queryKeys }: IParams) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      queryClient.invalidateQueries([queryKeys]);
    }
  }, [data, queryClient, queryKeys]);
};
