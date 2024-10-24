export interface Roles {
  name: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  concurrencyStamp: string;
  id: string;
  extraProperties: object;
}

export interface ListResult<T> {
  items: T[];
}
export type RolesList = ListResult<Roles>;
export interface RoleResponse {
  items: Roles[];
}
export interface CreateRoleRequest {
  name: string;
  permissionNames: string[];
}
export interface ChildPermission {
  id: string;
  name: string;
  code: string;
  creationTime: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  creationTime: string;
  children?: ChildPermission[];
}

export interface Role {
  extraProperties: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  id: string;
  name: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  concurrencyStamp: string;
  permissions: Permission[];
}
