import { LocalStorageKeys } from 'common/enums';
import { RouteProps } from 'react-router';
import { Navigate } from 'react-router-dom';
import { getItem } from 'utils/localStorage';

const PrivateRoute = ({ children }: RouteProps) => {
  const accessToken: string | null = getItem(LocalStorageKeys.accessToken);
  const isUnauthorized = accessToken === null;

  return isUnauthorized ? <Navigate to="/login" /> : children;
};

export default PrivateRoute;
