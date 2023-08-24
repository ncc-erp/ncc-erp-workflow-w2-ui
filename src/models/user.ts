import { LoginStatus } from 'common/enums';

export interface User {
	userName: string;
	name: string;
	surname: string;
	email: string;
	phoneNumber: string;
	logged: boolean;
	isExternal: boolean;
	hasPassword: boolean;
	concurrencyStamp: string;
	extraProperties: Record<string, unknown>;
}

export interface LoginParams {
	userNameOrEmailAddress: string;
	password: string;
	rememberMe: boolean;
}

export interface LoginResult {
	result: LoginStatus;
	description: string;
}
