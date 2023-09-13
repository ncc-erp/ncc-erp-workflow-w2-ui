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
import { useEffect, useState } from 'react';
import { validationSchema } from 'utils/validationSchema';

interface UserFormProps {
  initialValues: ModalUserParams;
  userId: string;
  onClose: () => void;
}

const UserForm = ({ initialValues, userId, onClose }: UserFormProps) => {
  const [userValues, setUserValues] = useState(initialValues);
  const { mutate, isLoading, isSuccess, isError } = useUpdateUser(
    userId,
    userValues
  );
  const queryClient = useQueryClient();

  const handleSubmit = async (values: ModalUserParams) => {
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
        <Tab>User information</Tab>
        <Tab>Roles</Tab>
      </TabList>
      <form onSubmit={formik.handleSubmit}>
        <TabPanels>
          <TabPanel>
            <TextField
              h="10"
              label="User name *"
              placeholder="User name"
              fontSize="small"
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
              fontSize="small"
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
              fontSize="small"
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
              fontSize="small"
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
            <TextField
              h="10"
              label="Email address *"
              placeholder="Email address"
              fontSize="small"
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
              fontSize="small"
              error={formik.errors.phoneNumber}
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
            />
            <Stack mt={5} direction="column">
              <Checkbox
                colorScheme="blue"
                isChecked={formik.values.isActive}
                onChange={(e) =>
                  handleChangeCheckbox('isActive', e.target.checked)
                }
              >
                Active
              </Checkbox>
              <Checkbox
                colorScheme="blue"
                isChecked={formik.values.lockoutEnabled}
                onChange={(e) =>
                  handleChangeCheckbox('lockoutEnabled', e.target.checked)
                }
              >
                Lock account after failed login attempts
              </Checkbox>
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack mt={5} direction="column">
              <Checkbox
                colorScheme="blue"
                isChecked={formik.values.roleNames.includes(UserRoles.ADMIN)}
                onChange={(e) =>
                  handleChangeRolesCheckbox(UserRoles.ADMIN, e.target.checked)
                }
              >
                {UserRoles.ADMIN}
              </Checkbox>
              <Checkbox
                colorScheme="blue"
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
        <Stack mt={5} mb={3} direction="row" justifyContent="center">
          <Button colorScheme="gray" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </Stack>
      </form>
    </Tabs>
  );
};

export default UserForm;