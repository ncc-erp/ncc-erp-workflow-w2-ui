import {
  LoginExternalParams,
  LoginParams,
  LoginResult,
  LoginExternalResult,
  User,
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

export const useGetUserInfo = () => {
  return useGetOne<User>([QueryKeys.GET_USER_INFO], '/app/auth/current-user');
};
