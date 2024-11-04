export interface Role {
  id: string;
  name: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  concurrencyStamp: string;
  permissions: Permission[];
  extraProperties: object;
}

export interface ListResult<T> {
  items: T[];
}
export type RolesList = ListResult<Role>;

export type RoleResponse = ListResult<Role>;
export interface CreateRoleRequest {
  name: string;
  permissionCodes: string[];
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
