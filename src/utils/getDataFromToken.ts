import { LocalStorageKeys } from 'common/enums';
import { parseJwt } from './parseJwt';

export const getDataFromToken = () => {
  const token = localStorage.getItem(LocalStorageKeys.accessToken);
  if (token) {
    return parseJwt(token);
  }
  return null;
};
