import { useLoginMezonByHash } from 'api/apiHooks/userHooks';
import { toast } from 'common/components/StandaloneToast';
import { MaxFailedAccessAttempts } from 'common/constants';
import { LocalStorageKeys } from 'common/enums';
import {
  MezonUserHash,
  MezonUserHashInfo,
  MezonUserProfile,
} from 'models/user';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getItem, setItem } from 'utils/localStorage';

const { VITE_MEZON_APP_ID } = import.meta.env;

export const useMezonLogin = () => {
  const navigate = useNavigate();

  const redirectURL = getItem(LocalStorageKeys.prevURL) || '/';
  const accessToken: string | null = getItem(LocalStorageKeys.accessToken);

  const [mezonUserProfile, setMezonUserProfile] =
    useState<MezonUserProfile | null>(null);
  const [userHashInfo, setUserHashInfo] = useState<MezonUserHashInfo>({
    web_app_data: '',
  });

  const {
    mutateAsync: loginMezonByHashMutate,
    isLoading: isLoginMezonLoading,
  } = useLoginMezonByHash();

  const [loginMezonFailed, setLoginMezonFailed] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    navigate(redirectURL);
  }, [accessToken, redirectURL, navigate]);

  useEffect(() => {
    if (window.Mezon && window.Mezon.WebView) {
      window.Mezon.WebView.postEvent('PING', { message: 'PING' }, () => {});

      const handlePong = () => {
        setItem(LocalStorageKeys.isInMezon, 'true');
      };
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const handleUserHash = async (_: any, userHashData: MezonUserHash) => {
        setUserHashInfo(userHashData.message);
      };
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const handleUserInfo = async (_: any, userData: MezonUserProfile) => {
        if (userData?.user) {
          setMezonUserProfile((prev) => ({
            ...prev,
            ...userData,
          }));
        }
      };

      window.Mezon.WebView.onEvent('PONG', handlePong);
      window.Mezon.WebView.postEvent('SEND_BOT_ID', {
        appId: VITE_MEZON_APP_ID,
      });
      window.Mezon.WebView.onEvent('USER_HASH_INFO', handleUserHash);
      window.Mezon.WebView.onEvent('CURRENT_USER_INFO', handleUserInfo);

      return () => {
        window.Mezon.WebView?.offEvent('PONG', handlePong);
        window.Mezon.WebView?.offEvent('USER_HASH_INFO', handleUserHash);
        window.Mezon.WebView?.offEvent('CURRENT_USER_INFO', handleUserInfo);
      };
    }
  }, [setUserHashInfo, setMezonUserProfile]);

  useEffect(() => {
    if (!userHashInfo?.web_app_data || !mezonUserProfile?.user) {
      return;
    }

    const loginMezonByHash = async () => {
      try {
        const [dataCheck, hashKey] = userHashInfo.web_app_data.split('&hash=');
        const { token, accessFailedCount } = await loginMezonByHashMutate({
          dataCheck,
          hashKey,
          userEmail: mezonUserProfile.email || '',
          userName: mezonUserProfile.user.username || '',
        });

        if (token) {
          setItem(LocalStorageKeys.accessToken, token);
          setItem(LocalStorageKeys.prevURL, '');
          window.location.href = redirectURL;
          return;
        }

        if (accessFailedCount) {
          const remainingAttempts = MaxFailedAccessAttempts - accessFailedCount;
          toast({
            title: `You have ${remainingAttempts} attempts left before your account is locked`,
            status: 'warning',
          });
          return;
        }

        toast({
          title: `User is locked out!`,
          status: 'error',
        });
      } catch (error) {
        setLoginMezonFailed(true);
      }
    };

    loginMezonByHash();
  }, [userHashInfo, mezonUserProfile, loginMezonByHashMutate, redirectURL]);

  return { isLoginMezonLoading, loginMezonFailed };
};
