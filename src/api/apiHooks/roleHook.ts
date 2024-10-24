import { CreateRoleRequest, Role, RoleResponse } from 'models/roles';
import { useCreate, useGetList, useGetOneIfValid, useUpdateRoles } from '.';
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
export const useGetOneRole = (id: string | null) => {
  return useGetOneIfValid<Role>(
    [QueryKeys.GET_SINGLE_ROLE],
    id,
    `/app/roles/roles/${id}`
  );
};
export const useUpdateRole = () => {
  return useUpdateRoles('/app/roles');
};
