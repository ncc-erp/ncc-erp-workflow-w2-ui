import {
  FilterUserParams,
  FilterUserResult,
  ModalUserParams,
  UserIdentity,
} from 'models/userIdentity';
import { useGetList, useGetOne, useUpdate } from '.';
import { Role, RolesList } from 'models/roles';
import { QueryKeys } from 'common/constants';

export const useRoles = () => {
  return useGetOne<RolesList>([QueryKeys.GET_ALL_ROLES], '/app/roles');
};

export const useUserIdentity = (filter: FilterUserParams) => {
  return useGetList<FilterUserResult>(
    [QueryKeys.FILTER_USER, filter],
    '/app/users',
    filter
  );
};

export const useRoleByUserId = (userId: string) => {
  return useGetList<Role>(
    [QueryKeys.GET_ROLE_BY_USER, userId],
    `/app/users/${userId}/roles`
  );
};

export const useUpdateUser = (userId: string, user: ModalUserParams) => {
  return useUpdate<string, ModalUserParams, UserIdentity>(
    `/app/users`,
    userId,
    user
  );
};

export const useUserPermissions = (id: string) => {
  return useGetOne<Role>(
    [QueryKeys.GET_USER_PERMISSIONS, id],
    `/app/users/${id}/permissions`
  );
};
