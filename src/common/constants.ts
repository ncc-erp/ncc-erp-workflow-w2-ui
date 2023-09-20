import { option } from 'common/types';

export const dateFormat = 'dd/MM/yyyy p';

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

export const RequestTemplateWorkflow = {
  CHANGE_OFFICE: 'ChangeOfficeRequestWorkflow',
  DEVICE_REQUEST: 'Device Request',
  OFFICE_EQUIPMENT: 'Office Equipment Request',
  WFH_REQUEST: 'WFH Request',
};

export const office = [
  {
    isCurrent: false,
    label: 'Hà Nội 1',
    value: 'Hà Nội 1',
  },
  {
    isCurrent: false,
    label: 'Hà Nội 2',
    value: 'Hà Nội 2',
  },
  {
    isCurrent: false,
    label: 'Hà Nội 3',
    value: 'Hà Nội 3',
  },
  {
    isCurrent: true,
    label: 'Đà Nẵng',
    value: 'Đà Nẵng',
  },
  {
    isCurrent: false,
    label: 'Vinh',
    value: 'Vinh',
  },
  {
    isCurrent: false,
    label: 'Sài Gòn 1',
    value: 'Sài Gòn 1',
  },
  {
    isCurrent: false,
    label: 'Sài Gòn 2',
    value: 'Sài Gòn 2',
  },
  {
    isCurrent: false,
    label: 'Quy Nhơn',
    value: 'Quy Nhơn',
  },
];

export const project = [
  {
    isCurrent: false,
    label: 'Company Activity',
    value: 'Company Activity',
  },
  {
    isCurrent: true,
    label: 'NCC-W2',
    value: 'NCC-W2',
  },
  {
    isCurrent: false,
    label: 'Yukimi',
    value: 'Yukimi',
  },
];
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
  W1: '1 weeks',
  W2: '2 weeks',
  W3: '3 weeks',
  M1: '1 months',
  M2: '2 months',
  M3: '3 months',
  Y1: '1 years',
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
  REQUEST_TEMPLATES: 'requestTemplates',
  GET_OFFICES: 'getOffices',
  GET_PROJECT_USER: 'getProjectsUser',
  GET_USER_INFO_WITH_BRANCH: 'getUserInfoWithBranch',
  GET_ALL_TASK: 'getAllTask',
  FILTER_TASK: 'filterTask',
  GET_WFH_LIST: 'getWfhList',
  GET_USER_CURRENT_PROJECT: 'getUserCurrentProject',
};

export const DEFAULT_FORMAT_DATE = 'dd-MM-yyyy HH:mm';
export const DEFAULT_TASK_PER_PAGE = 10;
