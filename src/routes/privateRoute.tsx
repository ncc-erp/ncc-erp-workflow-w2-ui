import { Center, Spinner } from '@chakra-ui/react';
import { useCurrentUser } from 'api/apiHooks/userHooks';
import { LocalStorageKeys } from 'common/enums';
import { useEffect } from 'react';
import { Navigate, RouteProps } from 'react-router';
import { useRecoilState } from 'recoil';
import { useClearUserData, userState } from 'stores/user';
import { getItem } from 'utils/localStorage';

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

  const accessToken: string | null = getItem(LocalStorageKeys.accessToken);
  const isUnauthorized =
    isFetched && (!userInfo?.userName || isError) && accessToken === null;

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

  if (isFetching)
    return (
      <Center h="100vh">
        <Spinner mx="auto" speed="0.65s" thickness="3px" size="xl" />
      </Center>
    );

  return isUnauthorized ? <Navigate to="/login" /> : children;
};

export default PrivateRoute;
