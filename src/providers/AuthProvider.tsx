import { Center, Spinner } from '@chakra-ui/react';
import { useGetUserInfo } from 'api/apiHooks/userHooks';
import { LocalStorageKeys } from 'common/enums';
import { PropsWithChildren, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { useSetUser } from 'stores/user';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useGetUserInfo();
  const { setUser, resetUser } = useSetUser();
  const setAppConfig = useSetRecoilState(appConfigState);

  useEffect(() => {
    user ? setUser(user) : resetUser();
    return resetUser;
  }, [setUser, resetUser, user]);

  useEffect(() => {
    const storedIsInMezon =
      localStorage.getItem(LocalStorageKeys.isInMezon) === 'true';
    const token = localStorage.getItem(LocalStorageKeys.accessToken);
    if (token) {
      setAppConfig((prev) => ({ ...prev, isInMezon: storedIsInMezon }));
    }
  }, [setAppConfig]);

  return isLoading ? (
    <Center height="100dvh">
      <Spinner size="xl" />
    </Center>
  ) : (
    children
  );
};
