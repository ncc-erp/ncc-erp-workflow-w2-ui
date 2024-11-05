import { useCurrentUser } from './useCurrentUser';

export const useUserPermissions = () => {
  const user = useCurrentUser();

  const hasPermission = (permission: string | string[]) => {
    return !user
      ? false
      : Array.isArray(permission)
      ? permission.some((perm) => user.permissions?.includes(perm))
      : user.permissions?.includes(permission);
  };

  const renderIfAllowed = (permission: string, element: JSX.Element) => {
    return hasPermission(permission) ? element : null;
  };

  return { hasPermission, renderIfAllowed };
};
