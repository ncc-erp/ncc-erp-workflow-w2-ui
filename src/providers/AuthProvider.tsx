import { Center, Spinner } from '@chakra-ui/react';
import { useGetUserInfo } from 'api/apiHooks/userHooks';
import { PropsWithChildren, useEffect } from 'react';
import { useSetUser } from 'stores/user';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useGetUserInfo();
  const { setUser, resetUser } = useSetUser();

  useEffect(() => {
    user ? setUser(user) : resetUser();
    return resetUser;
  }, [setUser, resetUser, user]);

  return isLoading ? (
    <Center height="100dvh">
      <Spinner size="xl" />
    </Center>
  ) : (
    children
  );
};
