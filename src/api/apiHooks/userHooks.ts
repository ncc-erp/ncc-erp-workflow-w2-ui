import { LoginExternalParams, LoginParams, LoginResult } from 'models/user';
import { useCreate } from 'api/apiHooks';

export const currentUserKey = ['currentUser'];

export const useLogin = () => {
  return useCreate<LoginParams, LoginResult>('/account/login');
};

export const useLoginExternal = () => {
  return useCreate<LoginExternalParams, LoginResult>(`/app/external-resource/external-login`);
};