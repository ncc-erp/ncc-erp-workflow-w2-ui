import { CreateRoleRequest, Role, RoleResponse } from 'models/roles';
import {
  useCreate,
  useGetList,
  useFetchResourceById,
  useUpdateRoles,
  useDelete,
} from '.';
import { QueryKeys } from 'common/constants';
import { Permissions } from 'models/permissions';

export const useGetAllRoles = () => {
  return useGetList<RoleResponse>([QueryKeys.GET_ROLES_LIST], '/app/roles');
};

export const useGetAllPermissions = () => {
  return useGetList<Permissions>(
    [QueryKeys.GET_PERMISSIONS_LIST],
    '/app/roles/permissions'
  );
};

export const useCreateRole = () => {
  return useCreate<CreateRoleRequest, RoleResponse>('/app/roles');
};

export const useGetOneRole = (id: string | null) => {
  return useFetchResourceById<Role>(
    [QueryKeys.GET_SINGLE_ROLE, id],
    id,
    `/app/roles/${id}`
  );
};

export const useUpdateRole = () => {
  return useUpdateRoles('/app/roles');
};
export const useDeleteRole = () => {
  return useDelete(`/app/roles`);
};
