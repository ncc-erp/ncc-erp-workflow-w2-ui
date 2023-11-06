export interface IPermissionItem {
  name: string;
  displayName: string;
  parentName: string;
  isGranted: boolean;
  allowedProviders: string[];
  grantedProviders: [
    {
      providerName: string;
      providerKey: string;
    },
  ];
}
export interface IPermissionList {
  name: string;
  displayName: string;
  permissions: IPermissionItem[];
}

export interface ListResult<T> {
  entityDisplayName: string;
  groups: T[];
}

export interface IUpdateUserPermissionRequest {
  permissions: IPermissionRequestItem[];
}

export interface IPermissionRequestItem {
  name: string;
  isGranted: boolean;
}

export type PermissionResult = ListResult<IPermissionList>;
