import { LocalStorageKeys } from 'common/enums';
import { RouteProps } from 'react-router';
import { Navigate } from 'react-router-dom';
import { getItem, setItem } from 'utils';

const PrivateRoute = ({ children }: RouteProps) => {
  const accessToken: string | null = getItem(LocalStorageKeys.accessToken);
  const isUnauthorized = accessToken === null;

  const isInMezon = getItem(LocalStorageKeys.isInMezon) === 'true';

  if (isUnauthorized && !isInMezon) {
    setItem(LocalStorageKeys.prevURL, window.location.href);
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
