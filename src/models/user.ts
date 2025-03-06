export interface User {
  sub: string[];
  name: string;
  email: string;
  given_name: string;
  role: string;
  permissions: string[];
}

export interface LoginParams {
  userNameOrEmailAddress: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginExternalParams {
  provider: string;
  idToken?: string;
}

export interface LoginMezonPayload {
  code: string;
  state: string;
  scope?: string;
}

export interface LoginResult {
  token: string;
  accessFailedCount: number;
}

export interface LoginExternalResult {
  token: string;
}

export interface UserInfo {
  email: string;
  fullName: string;
  branch: string;
}

export interface IUser {
  name: string;
  email: string;
}
