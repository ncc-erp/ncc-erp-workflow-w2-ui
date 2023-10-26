/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeOfficeRequestFormParams,
  DeviceRequestFormParams,
  FilterRequestParams,
  FilterRequestResult,
  OfficeEquipmentRequestFormParams,
  IRequestFormParams,
  RequestTemplateResult,
  WfhRequestFormParams,
  IRequestResult,
  ICreateFormParams,
  IUpdateInputFormParams,
} from 'models/request';
import {
  useCancelByPost,
  useDelete,
  useGetListByPost,
  useCreate,
  useGetOne,
  useGetList,
} from 'api/apiHooks';
import { QueryKeys } from 'common/constants';
import { officeList } from 'models/office';
import { ICurrentProject, projectList } from 'models/project';
import { IUser, UserInfo } from 'models/user';

export const useMyRequests = (filter: FilterRequestParams) => {
  return useGetListByPost<FilterRequestResult>(
    [QueryKeys.FILTER_REQUEST, filter],
    '/app/workflow-instance/list',
    filter
  );
};

export const useGetRequestDetail = (id: string) => {
  return useGetList<IRequestResult>(
    [QueryKeys.GET_REQUEST, id],
    `/app/workflow-instance/${id}/detail-by-id`
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
    [QueryKeys.REQUEST_TEMPLATES],
    '/app/workflow-definition/list-all'
  );
};

export const useRequestWorkflow = () => {
  return useCreate<ChangeOfficeRequestFormParams, any>('/account/login');
};

export const useOfficeEquipmentRequestWorkflow = () => {
  return useCreate<OfficeEquipmentRequestFormParams, any>('/account/login');
};

export const useWfhRequestWorkflow = () => {
  return useCreate<WfhRequestFormParams, any>('/account/login');
};

export const useDeviceRequestWorkflow = () => {
  return useCreate<DeviceRequestFormParams, any>('/account/login');
};

export const useOffices = () => {
  return useGetOne<typeof officeList>(
    [QueryKeys.GET_OFFICES],
    '/app/external-resource/of-office'
  );
};

export const useInputDefinition = () => {
  return useGetOne(
    [QueryKeys.GET_INPUT_DEFINITION],
    '/app/external-resource/workflow-input-definition-property-types'
  );
};

export const useUserProjects = () => {
  return useGetOne<typeof projectList>(
    [QueryKeys.GET_PROJECT_USER],
    '/app/external-resource/current-user-projects'
  );
};

export const useUserList = () => {
  return useGetOne<IUser[]>(
    [QueryKeys.GET_USER_LIST],
    '/app/external-resource/users-info'
  );
};

export const useUserInfoWithBranch = (userEmail: string) => {
  return useGetOne<UserInfo>(
    [QueryKeys.GET_USER_INFO_WITH_BRANCH, userEmail],
    `/app/external-resource/user-info-by-email?userEmail=${userEmail}`
  );
};

export const useNewRequestWorkflow = () => {
  return useCreate<IRequestFormParams, any>(
    '/app/workflow-instance/new-instance'
  );
};

export const useCreateWorkflowDefinition = () => {
  return useCreate<ICreateFormParams, any>(
    '/app/workflow-definition/workflow-definition'
  );
};

export const useUpdateWorkflowInput = () => {
  return useCreate<IUpdateInputFormParams, any>(
    '/app/workflow-definition/save-workflow-input-definition'
  );
};

export const useDeleteWorkflowDefinition = () => {
  return useDelete(`/app/workflow-definition`);
};

export const useUserCurrentProject = () => {
  return useGetOne<ICurrentProject>(
    [QueryKeys.GET_USER_CURRENT_PROJECT],
    '/app/external-resource/current-user-working-project'
  );
};
