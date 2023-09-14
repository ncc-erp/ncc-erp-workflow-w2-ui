import {
  Button,
  Checkbox,
  Divider,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateUser } from 'api/apiHooks/userIdentityHooks';
import { PasswordField } from 'common/components/PasswordField';
import { toast } from 'common/components/StandaloneToast';
import { TextField } from 'common/components/TextField';
import { QueryKeys, UserRoles } from 'common/constants';
import { useFormik } from 'formik';
import { ModalUserParams } from 'models/userIdentity';
import { ChangeEvent, useEffect, useState } from 'react';
import { validationSchema } from 'utils/validationSchema';

interface UserFormProps {
  initialValues: ModalUserParams;
  userId: string;
  onClose: () => void;
}

const UserForm = ({ initialValues, userId, onClose }: UserFormProps) => {
  const [userValues, setUserValues] = useState(initialValues);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  const { mutate, isLoading, isSuccess, isError } = useUpdateUser(
    userId,
    userValues
  );
  const queryClient = useQueryClient();

  const handleSubmit = async (values: ModalUserParams) => {
    if (passwordConfirm && values.password !== passwordConfirm) {
      setPasswordError('Passwords do not match');
      return;
    } else {
      setPasswordError('');
    }
    setUserValues(values);
    await mutate();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const handleUpdateResult = () => {
      if (isSuccess) {
        queryClient.invalidateQueries([QueryKeys.FILTER_USER]);
        queryClient.invalidateQueries([QueryKeys.GET_ROLE_BY_USER, userId]);
        onClose();
        toast({ title: 'Updated successfully', status: 'success' });
      } else if (isError) {
        toast({ title: 'Update failed', status: 'error' });
      }
    };
    handleUpdateResult();
  }, [isSuccess, isError, onClose, queryClient, userId]);

  const handleChangeCheckbox = (field: string, value: boolean | string[]) => {
    formik.setFieldValue(field, value);
  };

  const handleChangeRolesCheckbox = (roleName: string, checked: boolean) => {
    if (checked) {
      handleChangeCheckbox('roleNames', [...formik.values.roleNames, roleName]);
    } else {
      const updatedRoles = formik.values.roleNames.filter(
        (role) => role !== roleName
      );
      handleChangeCheckbox('roleNames', updatedRoles);
    }
  };

  return (
    <Tabs size="md" variant="enclosed">
      <TabList>
        <Tab fontSize="16px" fontWeight="medium">
          User information
        </Tab>
        <Tab fontSize="16px" fontWeight="medium">
          Roles
        </Tab>
      </TabList>
      <form onSubmit={formik.handleSubmit}>
        <TabPanels>
          <TabPanel p="0" mt="5">
            <TextField
              h="10"
              isRequired
              label="User name"
              placeholder="User name"
              fontSize={15}
              error={formik.errors.userName}
              name="userName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              autoComplete="off"
            />
            <TextField
              h="10"
              label="Name"
              placeholder="Name"
              fontSize={15}
              error={formik.errors.name}
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            <TextField
              h="10"
              label="Surname"
              placeholder="Surname"
              fontSize={15}
              error={formik.errors.surname}
              name="surname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.surname}
            />
            <PasswordField
              h="10"
              label="Password"
              placeholder="Password"
              fontSize={15}
              error={formik.errors.password}
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              autoComplete="off"
              iconsProps={{
                w: '18px',
                h: '18px',
              }}
              buttonProps={{
                mr: '10px',
              }}
            />
            <PasswordField
              h="10"
              label="Confirm Password"
              placeholder="Confirm Password"
              fontSize={15}
              error={passwordError}
              name="passwordConfirm"
              onChange={handlePasswordConfirmChange}
              onBlur={formik.handleBlur}
              value={passwordConfirm}
              autoComplete="off"
              iconsProps={{
                w: '18px',
                h: '18px',
              }}
              buttonProps={{
                mr: '10px',
              }}
            />
            <TextField
              h="10"
              label="Email address"
              placeholder="Email address"
              isRequired
              fontSize={15}
              error={formik.errors.email}
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              autoComplete="off"
            />
            <TextField
              h="10"
              label="Phone number"
              placeholder="Phone number"
              fontSize={15}
              error={formik.errors.phoneNumber}
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
            />
            <Stack mt={5} mb={5} direction="column">
              <Checkbox
                size="md"
                fontWeight="medium"
                colorScheme="gray"
                isChecked={formik.values.isActive}
                onChange={(e) =>
                  handleChangeCheckbox('isActive', e.target.checked)
                }
              >
                Active
              </Checkbox>
              <Checkbox
                colorScheme="gray"
                size="md"
                fontWeight="medium"
                isChecked={formik.values.lockoutEnabled}
                onChange={(e) =>
                  handleChangeCheckbox('lockoutEnabled', e.target.checked)
                }
              >
                Lock account after failed login attempts
              </Checkbox>
            </Stack>
          </TabPanel>
          <TabPanel p="0">
            <Stack mt={6} mb={6} direction="column">
              <Checkbox
                colorScheme="gray"
                isChecked={formik.values.roleNames.includes(UserRoles.ADMIN)}
                onChange={(e) =>
                  handleChangeRolesCheckbox(UserRoles.ADMIN, e.target.checked)
                }
              >
                {UserRoles.ADMIN}
              </Checkbox>
              <Checkbox
                colorScheme="gray"
                isChecked={formik.values.roleNames.includes(
                  UserRoles.DEFAULT_USER
                )}
                onChange={(e) =>
                  handleChangeRolesCheckbox(
                    UserRoles.DEFAULT_USER,
                    e.target.checked
                  )
                }
              >
                {UserRoles.DEFAULT_USER}
              </Checkbox>
            </Stack>
          </TabPanel>
        </TabPanels>
        <Divider></Divider>
        <Stack mb={3} mt={5} direction="row" justifyContent="center">
          <Button colorScheme="gray" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            background="primaryColor"
            color="white"
            type="submit"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Tabs>
  );
};

export default UserForm;
