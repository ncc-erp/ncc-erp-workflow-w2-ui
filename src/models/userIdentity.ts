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
}

export interface ModalUserParams {
  userName: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  lockoutEnabled: boolean;
  roleNames: string[];
  password?: string;
}
export interface FilterUserParams {
  filter: string;
  maxResultCount: number;
  skipCount: number;
  sorting: string;
}

export interface ListResult<T> {
  totalCount: number;
  items: T[];
}

export interface UserPermission {
  name: string;
  displayName: string;
  parentName: string;
  isGranted: boolean;
  allowedProviders: [];
  grantedProviders: [];
}
export interface PermissionParams {
  providerName: string;
  providerKey: string;
}

export type FilterUserResult = ListResult<UserIdentity>;
