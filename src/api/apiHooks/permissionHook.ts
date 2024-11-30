import { CreatePermissionInput } from 'models/permissions';

import { useCreate, useDelete, useUpdatePermissionData } from '.';
export const useCreatePermission = () => {
  return useCreate<CreatePermissionInput, null>('/app/permissions');
};
export const useUpdatePermission = () => {
  return useUpdatePermissionData(`/app/permissions`);
};
export const useDeletePermission = () => {
  return useDelete(`/app/permissions`);
};
