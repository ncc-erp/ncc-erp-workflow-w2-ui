import { useCurrentUser } from 'stores/user';

export const useUserPermissions = () => {
  const user = useCurrentUser();

  const hasPermission = (permission: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(permission)) {
      return permission.some((perm) => user.permissions?.includes(perm));
    }
    return user.permissions?.includes(permission);
  };

  const renderIfAllowed = (permission: string, element: JSX.Element) => {
    return hasPermission(permission) ? element : null;
  };

  return { hasPermission, renderIfAllowed };
};
