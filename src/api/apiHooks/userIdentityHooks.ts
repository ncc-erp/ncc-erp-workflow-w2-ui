import { FilterUserParams, FilterUserResult, ModalUserParams, UserIdentity } from "models/userIdentity";
import { useGetList, useGetOne, useUpdate } from ".";
import { RolesList } from "models/roles";

export const useRoles = () => {
  return useGetOne<RolesList>(
    ['getAllRoles'],
    '/identity/roles/all'
  );
};

export const useUserIdentity = (filter: FilterUserParams) => {
  return useGetList<FilterUserResult>(
    ['filterUser', filter],
    '/identity/users',
    filter
  );
};

export const useRoleByUserId = (userId: string) => {
  return useGetList<RolesList>(
    ['getRoleByUserId', userId],
    `/identity/users/${userId}/roles`,
  );
}

export const useUpdateUser = (userId: string, user: ModalUserParams) => {
  return useUpdate<string, ModalUserParams, UserIdentity>(
    `/identity/users`,
    userId,
    user
  );
}
