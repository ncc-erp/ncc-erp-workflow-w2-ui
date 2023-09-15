import { useGetList } from '.';
import { QueryKeys } from 'common/constants';
import { FilterWfhParams, FilterWfhResult } from 'models/report';

export const useWfhList = (filter: FilterWfhParams) => {
  return useGetList<FilterWfhResult>(
    [QueryKeys.GET_WFH_LIST, filter],
    '/app/workflow-instance/wfh-list',
    filter
  );
};
