import { option } from 'common/types';

export const DEFAULT_FORMAT_DATE = 'dd-MM-yyyy HH:mm';
export const WFH_FORMAT_DATE = 'DD/MM/YYYY';

export const noOfRows: option[] = [
  {
    value: 10,
    label: 10,
  },
  {
    value: 25,
    label: 25,
  },
  {
    value: 50,
    label: 50,
  },
  {
    value: 100,
    label: 100,
  },
];

export const requestTemplateWorkflow = {
  CHANGE_OFFICE: 'Change Office Request',
  DEVICE_REQUEST: 'Device Request',
  OFFICE_EQUIPMENT: 'Office Equipment Request',
  WFH_REQUEST: 'WFH Request',
};

export const BoardColumnStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

export const TaskStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

export const FilterDate = {
  W1: '1 week',
  // W2: '2 weeks',
  // W3: '3 weeks',
  M1: '1 month',
  // M2: '2 months',
  M3: '3 months',
  // Y1: '1 years',
};

export const DislayValue = {
  BOARD: 0,
  LIST: 1,
};

export const UnitTime = {
  YEAR: 'years',
  MONTH: 'months',
  WEEK: 'weeks',
};

export const FilterAll = {
  USER: 'All users',
  DATE: 'All date',
  TYPE: 'All types',
  STATUS: 'All status',
};

export const UserRoles = {
  ADMIN: 'admin',
  DEFAULT_USER: 'DefaultUser',
};

export const UserAction = {
  CREATE: 'Create',
  EDIT: 'Edit',
  PERMISSIONS: 'Permissions',
  DELETE: 'Delete',
};

export const QueryKeys = {
  GET_ALL_ROLES: 'getAllRoles',
  GET_ROLE_BY_USER: 'getRoleByUserId',
  FILTER_USER: 'filterUser',
  FILTER_REQUEST: 'filterRequest',
  GET_REQUEST: 'getRequest',
  REQUEST_TEMPLATES: 'requestTemplates',
  GET_OFFICES: 'getOffices',
  GET_PROJECT_USER: 'getProjectsUser',
  GET_USER_INFO_WITH_BRANCH: 'getUserInfoWithBranch',
  GET_ALL_TASK: 'getAllTask',
  GET_ALL_TASK_FILTERED: 'getAllTaskFiltered',
  GET_TASK: 'getTask',
  FILTER_TASK: 'filterTask',
  GET_WFH_LIST: 'getWfhList',
  GET_USER_CURRENT_PROJECT: 'getUserCurrentProject',
  GET_STAKE_HOLDERS_FOR_FILTER: 'getStakeHoldersForFilter',
  GET_USER_LIST: 'getUserList',
};

export const ColorThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const DEFAULT_TASK_PER_PAGE = 10;
export const TaskStatusesData = [
  { status: 'Pending', color: 'blue' },
  { status: 'Approved', color: 'green' },
  { status: 'Rejected', color: 'red' },
  { status: 'Faulted', color: 'yellow' },
  { status: 'Cancelled', color: 'gray' },
];

export const OtherActionSignalStatus = {
  PENDING: 0,
  APPROVE: 1,
  REJECT: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const ExternalAction = {
  APPROVED: 'approve',
  REJECTED: 'reject',
  OTHER: 'other',
};
