import { useCurrentUser } from 'api/apiHooks/userHooks';
import { useEffect } from 'react';
import { Navigate, RouteProps } from 'react-router';
import { useRecoilState } from 'recoil';
import { useClearUserData, userState } from 'stores/user';

const PrivateRoute = ({ children }: RouteProps) => {
  const clearUser = useClearUserData();
  const [user, setUser] = useRecoilState(userState);
  const {
    data: userInfo,
    isError,
    isFetched,
    isFetching,
    remove,
  } = useCurrentUser();
  const isUnauthorized = isFetched && (!userInfo?.userName || isError);

  useEffect(() => {
    if (isFetched && !user.logged) {
      setUser({ ...user, ...userInfo, logged: true });
    }
  }, [isFetched, setUser, user, userInfo]);

  useEffect(() => {
    isUnauthorized && clearUser();

    return () => {
      isUnauthorized && remove();
    };
  }, [clearUser, isUnauthorized, remove]);

  if (isFetching) return <div>Loading...</div>;

  return isUnauthorized ? <Navigate to='/login' /> : children;
};

export default PrivateRoute;
