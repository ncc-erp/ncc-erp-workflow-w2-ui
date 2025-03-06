import { useLoginMezon } from 'api/apiHooks/userHooks';
import { LocalStorageKeys } from 'common/enums';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { getItem, setItem } from 'utils/localStorage';
import { Spinner } from '@chakra-ui/react';

const LoginCallback = () => {
  const location = useLocation();

  const { mutateAsync: loginWithMezon, isLoading } = useLoginMezon();

  const paramValues = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);

    return ['code', 'scope', 'state'].map((param) => queryParams.get(param));
  }, [location.search]);

  useEffect(() => {
    const [code, scope, state] = paramValues;

    const handleLoginWithMezon = async (code: string, state: string) => {
      const { token } = await loginWithMezon({
        code,
        scope: scope || '',
        state,
      });
      const redirectURL = getItem(LocalStorageKeys.prevURL)
        ? getItem(LocalStorageKeys.prevURL)
        : '/';
      setItem(LocalStorageKeys.accessToken, token);
      setItem(LocalStorageKeys.prevURL, '');
      window.location.href = redirectURL ?? '/';
    };

    if (code && state) {
      handleLoginWithMezon(code, state);
    }
  }, [paramValues, loginWithMezon]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {isLoading && <Spinner size="xl" />}
    </div>
  );
};

export default LoginCallback;
