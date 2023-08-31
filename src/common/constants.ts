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

export const roleItems: option[] = [
  {
    value: '3a0d2b5e-303e-34cd-eb0a-91fa0ff1bb87',
    label: 'Admin',
  },
  {
    value: '3a0d2b5e-34b3-e52a-1e8f-d795068c6657',
    label: 'Default User',
  },
];

export const UserAction = {
  CREATE: 'Create',
  EDIT: 'Edit',
  PERMISSIONS: 'Permissions',
  DELETE: 'Delete',
};