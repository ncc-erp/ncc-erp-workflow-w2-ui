import { FilterUserParams, FilterUserResult } from "models/userIdentity";
import { useGetList, useGetOne } from ".";
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
