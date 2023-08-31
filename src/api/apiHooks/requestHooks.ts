import {
  FilterRequestParams,
  FilterRequestResult,
  RequestTemplateResult,
} from 'models/request';
import { useCancelByPost, useDelete, useGetListByPost } from 'api/apiHooks';

export const useMyRequests = (filter: FilterRequestParams) => {
  return useGetListByPost<FilterRequestResult>(
    ['filterRequest', filter + `${new Date()}`],
    '/app/workflow-instance/list',
    filter
  );
};

export const useDeleteRequest = () => {
  return useDelete(`/app/workflow-instance`);
};

export const useCancelRequest = () => {
  return useCancelByPost(`/app/workflow-instance`);
};

export const useRequestTemplates = () => {
  return useGetListByPost<RequestTemplateResult>(
    ['requestTemplates'],
    '/app/workflow-definition/list-all'
  );
};
