import { option } from 'common/types';

export const DEFAULT_FORMAT_DATE = 'dd-MM-yyyy HH:mm';

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
  Canceled: 3,
};

export const TaskStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  // Failed: 3,
  Canceled: 4,
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
  REQUEST_TEMPLATES: 'requestTemplates',
  GET_OFFICES: 'getOffices',
  GET_PROJECT_USER: 'getProjectsUser',
  GET_USER_INFO_WITH_BRANCH: 'getUserInfoWithBranch',
  GET_ALL_TASK: 'getAllTask',
  GET_TASK: 'getTask',
  FILTER_TASK: 'filterTask',
  GET_WFH_LIST: 'getWfhList',
  GET_USER_CURRENT_PROJECT: 'getUserCurrentProject',
};

export const TaskStatusesData = [
  { status: 'Pending', color: 'blue' },
  { status: 'Approved', color: 'green' },
  { status: 'Rejected', color: 'red' },
];
