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
