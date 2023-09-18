import { CurrentOffice } from 'common/constants';
import { OfficeCode } from 'common/types';

export const getOfficeNameByCode = (code: OfficeCode | undefined) => {
  if (code && CurrentOffice[code]) {
    return CurrentOffice[code];
  }
  return 'Unknown Office';
};
