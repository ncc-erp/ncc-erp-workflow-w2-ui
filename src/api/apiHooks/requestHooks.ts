import {
  FilterRequestParams,
  FilterRequestResult,
  RequestTemplateResult,
} from 'models/request';
import { useGetListByPost } from 'api/apiHooks';

export const useMyRequests = (filter: FilterRequestParams) => {
  return useGetListByPost<FilterRequestResult>(
    ['FilterRequest', filter],
    '/app/workflow-instance/list',
    filter
  );
};

export const useRequestTemplates = () => {
  return useGetListByPost<RequestTemplateResult>(
    ['requestTemplates'],
    '/app/workflow-definition/list-all'
  );
};
