import { useCurrentUser } from './useCurrentUser';

export const useUserPermissions = () => {
  const user = useCurrentUser();

  const hasPermission = (permission: string) => {
    if (!user) {
      return false;
    }
    return user.permissions?.includes(permission);
  };

  const renderIfAllowed = (permission: string, element: JSX.Element) => {
    return hasPermission(permission) ? element : null;
  };

  return { hasPermission, renderIfAllowed };
};
