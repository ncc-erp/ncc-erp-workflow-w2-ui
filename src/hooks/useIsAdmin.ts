import { UserRoles } from 'common/constants';
import { LocalStorageKeys } from 'common/enums';
import { useMemo } from 'react';
import { parseJwt } from 'utils';

export function useIsAdmin() {
  const token = localStorage.getItem(LocalStorageKeys.accessToken);
  const decodedToken = useMemo(() => {
    if (token) {
      return parseJwt(token);
    }
    return null;
  }, [token]);
  const isAdmin = decodedToken ? decodedToken.role === UserRoles.ADMIN : false;

  return isAdmin;
}
