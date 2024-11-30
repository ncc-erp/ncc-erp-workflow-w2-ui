export interface Permissions {
  id: string;
  name: string;
  code: string;
  creationTime: string;
  children?: Permissions[];
}
export interface CreatePermissionInput {
  name: string;
  code: string;
  parentId?: string;
}
