import { atom, useResetRecoilState } from 'recoil';
import { User } from 'models/user';
import { useCallback } from 'react';
import cookie from 'js-cookie';

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

export const useClearUserData = () => {
	const resetUser = useResetRecoilState(userState);

	const clearData = useCallback(() => {
		resetUser();
		cookie.remove('username');
	}, [resetUser]);

	return clearData;
};
