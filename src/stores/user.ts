import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { User } from 'models/user';
import { useCallback } from 'react';

const initialState: User = {
  sub: [],
  name: '',
  email: '',
  given_name: '',
  role: '',
  permissions: [],
};

export const userState = atom({
  key: 'userState',
  default: initialState,
});

export const useSetUser = () => {
  const setUser = useSetRecoilState(userState);

  const resetUser = useCallback(() => setUser(initialState), [setUser]);

  return { setUser, resetUser };
};

export const useCurrentUser = () => {
  return useRecoilValue(userState);
};
