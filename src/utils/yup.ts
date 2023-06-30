/* eslint-disable no-useless-escape */
import * as Yup from "yup";

export const personalInfoSchema = Yup.object().shape({
  email: Yup.string()
    .required("The Email field is required.")
    .email("Email is invalid")
    .max(256, "The field Email must be a string with a maximum length of 256."),
  userName: Yup.string()
    .required("The Username field is required.")
    .max(
      256,
      "The field Username must be a string with a maximum length of 256."
    ),
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required(
    "The Current pasword field is required."
  ),
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/.*[A-Z]+.*/, "Must contain at least one uppercase letter")
    .matches(/.*[0-9]+.*/, "Must contain at least one number")
    .matches(
      /.*[!@#\$%\^&\*]+.*/,
      "Must contain at least one special character"
    )
    .max(
      128,
      "The field New password must be a string with a maximum length of 128."
    ),
  newPasswordConfirm: Yup.string()
    .required("Confirm new password is required")
    .oneOf([Yup.ref("newPassword")], "Confirm new password does not match"),
});

