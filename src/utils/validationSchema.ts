import * as yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validationSchema = yup.object().shape({
  userName: yup.string().required('User name field is required!'),
  password: yup
    .string()
    .nullable()
    .min(6, 'Passwords must be at least 6 characters')
    .matches(
      /[a-zA-Z]/,
      'Passwords must have at least one non alphanumeric character'
    )
    .matches(/[0-9]/, 'Passwords must have at least one digit')
    .matches(/[^a-zA-Z0-9]/, 'Passwords must have at least one uppercase'),
  email: yup
    .string()
    .required('Email address field is required!')
    .email('Email address field is not a valid e-mail address.'),
  phoneNumber: yup
    .string()
    .nullable()
    .min(10, 'Phone number is not valid')
    .matches(phoneRegExp, 'Phone number is not valid'),
});
