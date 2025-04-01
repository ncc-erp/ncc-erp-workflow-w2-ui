import {
  LoginExternalParams,
  LoginParams,
  LoginResult,
  LoginExternalResult,
  User,
  LoginMezonPayload,
  LoginMezonByHashParams,
} from 'models/user';
import { useCreate, useGetOne } from 'api/apiHooks/index';
import { QueryKeys } from 'common/constants';

export const useLogin = () => {
  return useCreate<LoginParams, LoginResult>('/app/auth/login-account');
};

export const useLoginExternal = () => {
  return useCreate<LoginExternalParams, LoginExternalResult>(
    `/app/external-resource/external-login`
  );
};

export const useLoginMezon = () => {
  return useCreate<LoginMezonPayload, LoginExternalResult>(
    `/app/external-resource/mezon-login`
  );
};

export const useMezonAuthUrl = () => {
  return useCreate<null, string>(`/app/external-resource/mezon-auth-url`);
};

export const useGetUserInfo = () => {
  return useGetOne<User>([QueryKeys.GET_USER_INFO], '/app/auth/current-user');
};

export const useLoginMezonByHash = () => {
  return useCreate<LoginMezonByHashParams, LoginResult>(
    '/app/auth/login-mezon-by-hash'
  );
};
