import {
  FilterRequestParams,
  FilterRequestResult,
  RequestTemplateResult,
} from 'models/request';
import { useCancelByPost, useDelete, useGetListByPost } from 'api/apiHooks';
import { QueryKeys } from 'common/constants';

export const useMyRequests = (filter: FilterRequestParams) => {
  return useGetListByPost<FilterRequestResult>(
    [QueryKeys.FILTER_REQUEST, filter],
    '/app/workflow-instance/list',
    filter
  );
};

export const useDeleteRequest = () => {
  return useDelete(
    `/app/workflow-instance`,
  );
};

export const useCancelRequest = () => {
  return useCancelByPost(
    `/app/workflow-instance`,
  );
};

export const useRequestTemplates = () => {
  return useGetListByPost<RequestTemplateResult>(
    [QueryKeys.REQUEST_TEMPLATES],
    '/app/workflow-definition/list-all'
  );
};
