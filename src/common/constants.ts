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
