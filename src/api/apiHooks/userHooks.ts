import {
  LoginExternalParams,
  LoginParams,
  LoginResult,
  LoginExternalResult,
} from 'models/user';
import { useCreate } from 'api/apiHooks/index';

export const useLogin = () => {
  return useCreate<LoginParams, LoginResult>('/app/auth/login-account');
};

export const useLoginExternal = () => {
  return useCreate<LoginExternalParams, LoginExternalResult>(
    `/app/external-resource/external-login`
  );
};
