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

export interface LoginMezonByHashParams {
  userName: string;
  userEmail: string;
  dataCheck: string;
  hashKey: string;
}

export interface MezonUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  lang_tag: string;
  metadata: string;
  google_id: string;
  online: boolean;
  edge_count: number;
  create_time: string;
  update_time: string;
  dob: string;
}

export interface Wallet {
  value: number;
}

export interface MezonUserProfile {
  user: MezonUser;
  wallet: string;
  email: string;
  mezon_id: string;
}

export interface MezonUserHash {
  message: MezonUserHashInfo;
}

export interface MezonUserHashInfo {
  web_app_data: string;
}
