export interface ISetting {
  id?: string;
  code?: string;
  name?: string;
  value: string;
}

export interface ISettingValue {
  code?: string;
  name?: string;
  email?: string;
}

export interface ISettingPayload extends ISettingValue {
  settingCode: string;
}

export interface IListResult<T> {
  totalCount: number;
  items: T[];
}

export interface IFilterSettingParams {
  settingCode: ESettingCode;
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
}

export enum ESettingCode {
  DIRECTOR = 'Director',
  CEO = 'CEO',
  SALE = 'Sale',
  IT = 'IT',
  HR = 'HR',
  HPM = 'HPM',
}

export enum ESettingError {
  CREATE_SUCCESSFULLY = 'Create setting Successfully',
  DELETE_SUCCESSFULLY = 'Delete setting Successfully',
  EMAIL_ALREADY_EXIST = 'This email is already in use',
  UPDATE_SUCCESSFULLY = 'Update setting Successfully',
  CODE_ALREADY_EXIST = 'This code already exist',
}
