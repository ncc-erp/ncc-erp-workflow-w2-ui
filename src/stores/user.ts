import { atom } from 'recoil';
import { User } from 'models/user';

const initialState: User = {
  logged: false,
  username: localStorage.getItem('username') ?? '',
  firstname: localStorage.getItem('firstname') ?? '',
  surname: localStorage.getItem('surname') ?? '',
  email: localStorage.getItem('email') ?? '',
  phoneNumber: localStorage.getItem('phoneNumber') ?? '',
};

export const userState = atom({
  key: 'userState',
  default: initialState,
});
