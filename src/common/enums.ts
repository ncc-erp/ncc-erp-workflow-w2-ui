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
  [RequestStatus.Approved]: 'MY_REQUESTS_PAGE.REQUEST_STATUS.APPROVED',
  [RequestStatus.Rejected]: 'MY_REQUESTS_PAGE.REQUEST_STATUS.REJECTED',
  [RequestStatus.Pending]: 'MY_REQUESTS_PAGE.REQUEST_STATUS.PENDING',
  [RequestStatus.Canceled]: 'MY_REQUESTS_PAGE.REQUEST_STATUS.CANCELED',
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
