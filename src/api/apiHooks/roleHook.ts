import { CreateRoleRequest, RoleResponse } from 'models/roles';
import { useCreate, useGetList } from '.';
import { QueryKeys } from 'common/constants';
import { Permissions } from 'models/permissions';

export const useGetAllRoles = () => {
  return useGetList<RoleResponse>([QueryKeys.GET_ROLES_LIST], '/app/roles');
};
export const useGetAllPermissions = () => {
  return useGetList<Permissions>(
    [QueryKeys.GET_PERMISSIONS_LIST],
    '/app/roles/permissions/all'
  );
};
export const useCreateRole = () => {
  return useCreate<CreateRoleRequest, RoleResponse>('/app/roles');
};
