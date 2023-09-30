import { LoginExternalParams, LoginParams, LoginResult } from 'models/user';
import { useCreate } from 'api/apiHooks';

export const useLogin = () => {
  return useCreate<LoginParams, LoginResult>('/app/auth/login-account');
};

export const useLoginExternal = () => {
  return useCreate<LoginExternalParams, LoginResult>(
    `/app/external-resource/external-login`
  );
};
