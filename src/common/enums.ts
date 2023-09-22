export enum LoginStatus {
  success = 1,
  failed = 2,
}

export enum RequestStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Pending = 'Suspended',
  Canceled = 'Cancelled',
}

export enum ETaskStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum RequestSortField {
  createdAt = 'createdAt',
  lastExecutedAt = 'lastExecutedAt',
}

export enum UserSortField {
  userName = 'userName',
  email = 'email',
  phoneNumber = 'phoneNumber',
}

export enum WfhSortField {
  email = 'Email',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export enum LocalStorageKeys {
  accessToken = 'accessToken',
  expireInSeconds = 'expireInSeconds',
  currentUser = 'currentUser',
}
