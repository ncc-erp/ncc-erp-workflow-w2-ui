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

export const REQUEST_TEMPLATE_I18N_KEY: Record<string, string> = {
  'Change Office Request': 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.CHANGE_OFFICE',
  'Device Request': 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.DEVICE_REQUEST',
  'Office Equipment Request':
    'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.OFFICE_EQUIPMENT',
  'WFH Request': 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.WFH_REQUEST',
  'User Task': 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.USER_TASK',
  'Not Found': 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.NOT_FOUND',
  'Probationary Confirmation Request':
    'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.PROBATION_CONFIRMATION_REQUEST',
  WFH_Request: 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.WFH_REQUEST',
  NotFound: 'MY_REQUESTS_PAGE.REQUEST_TEMPLATES.NOT_FOUND',
};

export const resolveRequestTemplateI18nKey = (
  displayName?: string
): string | undefined => {
  if (!displayName) return undefined;
  // try direct exact match first
  if (REQUEST_TEMPLATE_I18N_KEY[displayName])
    return REQUEST_TEMPLATE_I18N_KEY[displayName];

  const normalize = (s: string) =>
    s
      .replace(/([a-z])([A-Z])/g, '$1 $2') // split camel/pascal: NotFound -> Not Found
      .replace(/[_-]+/g, ' ') // underscores / hyphens -> space
      .replace(/\s+/g, ' ') // collapse whitespace
      .trim()
      .toLowerCase();

  const norm = normalize(displayName);
  const found = Object.keys(REQUEST_TEMPLATE_I18N_KEY).find(
    (k) => normalize(k) === norm
  );
  return found ? REQUEST_TEMPLATE_I18N_KEY[found] : undefined;
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

export const WFHFilterDate = {
  CM: 'current month',
  M2: '2 month',
  M3: '3 months',
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
  DESIGNER: 'Designer',
};

export const UserAction = {
  CREATE: 'Create',
  EDIT: 'Edit',
  PERMISSIONS: 'Permissions',
  DELETE: 'Delete',
};

export const QueryKeys = {
  GET_RELEASE_CONTENT: 'getReleaseContent',
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
  GET_INPUT_DEFINITION: 'getInputDefinition',
  GET_SETTING_LIST: 'getSettingList',
  GET_ROLES_LIST: 'roles',
  GET_PERMISSIONS_LIST: 'getPermissionsList',
  GET_SINGLE_ROLE: 'getSingleRole',
  GET_USER_PERMISSIONS: 'getUserPermissions',
  GET_USER_INFO: 'getUserInfo',
  GET_MEZON_AUTH_URL: 'getMezonAuthUrl',
  GET_WEBHOOKS: 'getWebhooks',
};

export const ColorThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const GUID_ID_DEFAULT_VALUE = '00000000-0000-0000-0000-000000000000';

export const DEFAULT_TASK_PER_PAGE = 10;
export const TaskStatusesData = [
  { status: 'Pending', color: 'blue' },
  { status: 'Approved', color: 'green' },
  { status: 'Rejected', color: 'red' },
  { status: 'Faulted', color: 'yellow' },
  { status: 'Canceled', color: 'gray' },
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

export const DynamicData = {
  STRENGTH_POINT: 'StrengthPoints',
  WEAKNESS_POINT: 'WeaknessPoints',
};

export const LinkDocRedirect = {
  RELEASE_DOCS:
    'https://docs.google.com/document/d/1Vemp4XltVPYSEVKTAKqcCRNPuQu3RX7Dxon7dtwOfMU/edit',
  USER_GUIDE_DOCS:
    'https://docs.google.com/document/d/1xJxLj8JiXc3yNJC2drjqxzGsk9bCSgHxRuTZBFOnUqw/edit',
};

export const MaxFailedAccessAttempts = 5;

export const UPDATED_BY_W2 = 'W2 Workflow';
export const UserRoleLabelMapping = {
  ADMIN: 'Admin',
  DEFAULT_USER: 'Default User',
  DESIGNER: 'Designer',
  UNASSIGNED: 'N/A',
};
export const Permissions = {
  WORKFLOW_DEFINITIONS: 'WorkflowDefinitions',
  VIEW_WORKFLOW_DEFINITIONS: 'WorkflowDefinitions.View',
  CREATE_WORKFLOW_DEFINITION: 'WorkflowDefinitions.Create',
  UPDATE_WORKFLOW_DEFINITION_STATUS: 'WorkflowDefinitions.UpdateStatus',
  DELETE_WORKFLOW_DEFINITION: 'WorkflowDefinitions.Delete',
  DEFINE_INPUT: 'WorkflowDefinitions.DefineInput',
  EDIT_WORKFLOW_DEFINITION: 'WorkflowDefinitions.Edit',
  IMPORT_WORKFLOW_DEFINITION: 'WorkflowDefinitions.Import',

  WORKFLOW_INSTANCES: 'WorkflowInstances',
  VIEW_WORKFLOW_INSTANCES: 'WorkflowInstances.View',
  VIEW_ALL_WORKFLOW_INSTANCES: 'WorkflowInstances.ViewAll',
  CREATE_WORKFLOW_INSTANCE: 'WorkflowInstances.Create',
  CANCEL_WORKFLOW_INSTANCE: 'WorkflowInstances.Cancel',

  WFH_REPORTS: 'WFHReport',
  VIEW_WFH_REPORTS: 'WFHReport.View',

  TASKS: 'Tasks',
  VIEW_TASKS: 'Tasks.View',
  VIEW_ALL_TASKS: 'Tasks.ViewAll',
  UPDATE_TASK_STATUS: 'Tasks.UpdateStatus',
  ASSIGN_TASK: 'Tasks.Assign',

  ADMIN: 'Admin',
  USERS: 'Users',
  VIEW_USERS: 'Users.View',
  UPDATE_USER: 'Users.Update',

  SETTINGS: 'Settings',
  VIEW_SETTINGS: 'Settings.View',
  CREATE_SETTINGS: 'Settings.Create',
  UPDATE_SETTINGS: 'Settings.Update',
  DELETE_SETTINGS: 'Settings.Delete',

  ROLES: 'Roles',
  VIEW_ROLES: 'Roles.View',
  CREATE_ROLE: 'Roles.Create',
  UPDATE_ROLE: 'Roles.Update',
  DELETE_ROLE: 'Roles.Delete',
  DELETE_USER_ON_ROLE: 'Roles.DeleteUserOnRole',

  PERMISSIONS: 'Permissions',
  VIEW_PERMISSIONS: 'Permissions.View',
  CREATE_PERMISSION: 'Permissions.Create',
  UPDATE_PERMISSION: 'Permissions.Update',
  DELETE_PERMISSION: 'Permissions.Delete',

  WEBHOOKS: 'Webhooks',
  VIEW_WEBHOOKS: 'Webhooks.View',
  CREATE_WEBHOOK: 'Webhooks.Create',
  UPDATE_WEBHOOK: 'Webhooks.Update',
  DELETE_WEBHOOK: 'Webhooks.Delete',
};

export const EVENT_OPTIONS = [
  'Request Created',
  'Request Finished',
  'Request Assigned',
];

export const MaxReleaseContentLine = 8;
