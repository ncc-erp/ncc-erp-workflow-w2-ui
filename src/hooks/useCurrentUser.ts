import { LocalStorageKeys } from 'common/enums';
import { useMemo } from 'react';
import { parseJwt } from 'utils/parseJwt';

export function useCurrentUser() {
  const token = localStorage.getItem(LocalStorageKeys.accessToken);
  const currentUser = useMemo(() => {
    if (token) {
      return parseJwt(token);
    }
    return null;
  }, [token]);

  return currentUser;
}
