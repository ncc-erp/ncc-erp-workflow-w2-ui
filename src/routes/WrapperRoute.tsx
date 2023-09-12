import { RouteProps } from 'react-router';
import PrivateRoute from 'routes/privateRoute';

export type WrapperRouteProps = RouteProps & {
  auth?: boolean;
};

const WrapperRoute = ({ auth, children }: WrapperRouteProps) => {
  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return <>{children}</>;
};

export default WrapperRoute;
