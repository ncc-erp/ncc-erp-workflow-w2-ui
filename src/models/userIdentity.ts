export interface UserIdentity {
  tenantId: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  isActive: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string;
  concurrencyStamp: string;
  isDeleted: boolean;
  deleterId: string;
  deletionTime: string;
  lastModificationTime: string;
  lastModifierId: string;
  creationTime: string;
  creatorId: string;
  id: string;
  extraProperties: object;
  roles: string[];
  mezonUserId?: string;
}

export interface ModalUserParams {
  userName: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  lockoutEnabled: boolean;
  roleNames: string[] | string;
  password?: string;
  customPermissionCodes?: string[];
  mezonUserId?: string;
}
export interface FilterUserParams {
  filter: string;
  maxResultCount: number;
  skipCount: number;
  sorting: string;
  role: string;
}

export interface ListResult<T> {
  totalCount: number;
  items: T[];
}

export type FilterUserResult = ListResult<UserIdentity>;
