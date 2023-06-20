import { FC, useEffect } from 'react';
import { Navigate, RouteProps } from 'react-router';
import { useRecoilState } from 'recoil';
import { userState } from 'stores/user';

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const [user] = useRecoilState(userState);
  const logged = user.username ? true : false;

  useEffect(() => {
    // TODO: logic & set user
  }, []);

  return logged ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
