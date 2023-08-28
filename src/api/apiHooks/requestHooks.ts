/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeOfficeRequestFormParams,
  DeviceRequestFormParams,
  FilterRequestParams,
  FilterRequestResult,
  OfficeEquipmentRequestFormParams,
  RequestTemplateResult,
  WfhRequestFormParams,
} from 'models/request';
import { useCreate, useGetListByPost } from 'api/apiHooks';

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
