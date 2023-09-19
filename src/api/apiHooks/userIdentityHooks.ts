import {
  FilterUserParams,
  FilterUserResult,
  ModalUserParams,
  UserIdentity,
} from 'models/userIdentity';
import { useGetList, useGetOne, useUpdate } from '.';
import { RolesList } from 'models/roles';
import { QueryKeys } from 'common/constants';
import { useIsAdmin } from 'hooks/useIsAdmin';

export const useRoles = () => {
  return useGetOne<RolesList>([QueryKeys.GET_ALL_ROLES], '/identity/roles/all');
};

export const useUserIdentity = (filter: FilterUserParams) => {
  const isAdmin = useIsAdmin();
  return useGetList<FilterUserResult>(
    [QueryKeys.FILTER_USER, filter],
    '/identity/users',
    filter,
    { enabled: isAdmin }
  );
};

export const useRoleByUserId = (userId: string) => {
  return useGetList<RolesList>(
    [QueryKeys.GET_ROLE_BY_USER, userId],
    `/identity/users/${userId}/roles`
  );
};

export const useUpdateUser = (userId: string, user: ModalUserParams) => {
  return useUpdate<string, ModalUserParams, UserIdentity>(
    `/identity/users`,
    userId,
    user
  );
};
