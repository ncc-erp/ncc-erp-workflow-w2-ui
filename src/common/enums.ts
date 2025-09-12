export enum LoginStatus {
  success = 1,
  failed = 2,
}

export enum RequestStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Pending = 'Pending',
  Canceled = 'Canceled',
}

export const REQUEST_STATUS_I18N_KEY: Record<RequestStatus, string> = {
  [RequestStatus.Approved]: 'common.requestStatus.approved',
  [RequestStatus.Rejected]: 'common.requestStatus.rejected',
  [RequestStatus.Pending]: 'common.requestStatus.pending',
  [RequestStatus.Canceled]: 'common.requestStatus.canceled',
};

export enum ETaskStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum RequestSortField {
  createdAt = 'createdAt',
  lastExecutedAt = 'lastExecutedAt',
}

export enum SettingSortField {
  name = 'name',
  email = 'email',
  code = 'code',
}

export enum UserSortField {
  userName = 'userName',
  email = 'email',
  phoneNumber = 'phoneNumber',
}

export enum WfhSortField {
  email = 'email',
  creationTime = 'creationTime',
  remoteDate = 'remoteDate',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export enum LocalStorageKeys {
  accessToken = 'accessToken',
  expireInSeconds = 'expireInSeconds',
  currentUser = 'currentUser',
  prevURL = 'prevURL',
  isInMezon = 'isInMezon',
}
