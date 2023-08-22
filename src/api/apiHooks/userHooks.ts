import { LoginExternalParams, LoginParams, LoginResult, User } from 'models/user';
import { useCreate, useGetOne } from 'api/apiHooks';

export const currentUserKey = ['currentUser'];

export const useLogin = () => {
  return useCreate<LoginParams, LoginResult>('/account/login');
};

export const useLoginExternal = () => {
  return useCreate<LoginExternalParams, LoginResult>('/external-resource/external-login');
};

export const useCurrentUser = () => {
  return useGetOne<User>(currentUserKey, '/account/my-profile');
};
