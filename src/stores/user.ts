import { atom } from 'recoil';
import { User } from 'models/user';

const initialState: User = {
  logged: false,
  userName: localStorage.getItem('username') ?? '',
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
  isExternal: false,
  hasPassword: false,
  concurrencyStamp: '',
  extraProperties: {},
};

export const userState = atom({
  key: 'userState',
  default: initialState,
});
