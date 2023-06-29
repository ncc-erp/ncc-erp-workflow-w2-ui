import { useCurrentUser } from 'api/apiHooks/userHooks';
import { useEffect } from 'react';
import { Navigate, RouteProps } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useClearUserData, userState } from 'stores/user';

const PrivateRoute = ({ children }: RouteProps) => {
  const navigate = useNavigate();
  const clearUser = useClearUserData();
  const [user, setUser] = useRecoilState(userState);
  const { data: userInfo, isError, isFetched, remove } = useCurrentUser();
  const isLogged = user.logged || !!user?.userName;
  const isUnauthorized = isError || (isFetched && !userInfo?.userName);

  useEffect(() => {
    if (!user.logged) {
      setUser({ ...user, ...userInfo, logged: true });
    }
  }, [setUser, user, userInfo]);

  useEffect(() => {
    if (isUnauthorized) {
      clearUser();
      navigate('/login');
    }

    return () => {
      isUnauthorized && remove();
    };
  }, [clearUser, isUnauthorized, navigate, remove]);

  return isLogged ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
