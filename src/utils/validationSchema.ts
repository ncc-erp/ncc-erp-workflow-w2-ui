import * as yup from 'yup';

import i18n from './../i18n/config';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// Helper function to get translation
const t = (key: string) => i18n.t(key);

export const validationSchema = yup.object().shape({
  userName: yup.string().required(t('VALIDATION.USER_NAME_REQUIRED')),
  password: yup
    .string()
    .nullable()
    .min(6, t('VALIDATION.PASSWORD_MIN_LENGTH'))
    .matches(/[a-zA-Z]/, t('VALIDATION.PASSWORD_NON_ALPHANUMERIC'))
    .matches(/[0-9]/, t('VALIDATION.PASSWORD_DIGIT'))
    .matches(/[A-Z]/, t('VALIDATION.PASSWORD_UPPERCASE'))
    .matches(/[^a-zA-Z0-9]/, t('VALIDATION.PASSWORD_SPECIAL_CHARACTER')),
  email: yup
    .string()
    .required(t('VALIDATION.EMAIL_REQUIRED'))
    .email(t('VALIDATION.EMAIL_INVALID')),
  phoneNumber: yup
    .string()
    .nullable()
    .min(10, t('VALIDATION.PHONE_MIN_LENGTH'))
    .matches(phoneRegExp, t('VALIDATION.PHONE_INVALID')),
});

export const validationDirectorSettingForm = yup.object().shape({
  name: yup.string().required(t('VALIDATION.NAME_REQUIRED')),
  code: yup.string().required(t('VALIDATION.CODE_REQUIRED')),
  email: yup
    .string()
    .required(t('VALIDATION.EMAIL_REQUIRED'))
    .email(t('VALIDATION.EMAIL_INVALID')),
});

export const validationSettingForm = yup.object().shape({
  email: yup
    .string()
    .required(t('VALIDATION.EMAIL_REQUIRED'))
    .email(t('VALIDATION.EMAIL_INVALID')),
});
