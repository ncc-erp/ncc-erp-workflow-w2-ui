import { usePageTracking } from 'hooks/useTrackingPage';
import { RouteProps } from 'react-router';
import PrivateRoute from 'routes/privateRoute';

export type WrapperRouteProps = RouteProps & {
  auth?: boolean;
};

const WrapperRoute = ({ auth, children }: WrapperRouteProps) => {
  usePageTracking();
  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return <>{children}</>;
};

export default WrapperRoute;
