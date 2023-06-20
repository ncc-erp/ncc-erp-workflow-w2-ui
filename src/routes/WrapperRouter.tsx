import { RouteProps } from 'react-router';
import PrivateRoute from 'routes/privateRoute';

export type WrapperRouteProps = RouteProps & {
  auth?: boolean;
};

const WrapperRouter = ({ auth, children }: WrapperRouteProps) => {
  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return children;
};

export default WrapperRouter;
