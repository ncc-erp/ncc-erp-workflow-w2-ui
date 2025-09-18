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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAllPermissions, useGetAllRoles } from 'api/apiHooks/roleHook';
import {
  useUpdateUser,
  useUserPermissions,
} from 'api/apiHooks/userIdentityHooks';
import { PasswordField } from 'common/components/PasswordField';
import PermissionCheckbox from 'common/components/PermissionCheckbox';
import { toast } from 'common/components/StandaloneToast';
import { TextField } from 'common/components/TextField';
import { QueryKeys } from 'common/constants';
import { useFormik } from 'formik';
import { useCurrentUser } from 'stores/user';
import { ModalUserParams } from 'models/userIdentity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { convertToCase } from 'utils';
import { useTranslation } from 'react-i18next';
import { getValidationSchema } from 'utils/validationSchema'; // ✅ Import function

interface UserFormProps {
  initialValues: ModalUserParams;
  userId: string;
  onClose: () => void;
  isOpen: boolean;
}

const UserForm = ({
  initialValues,
  userId,
  onClose,
  isOpen,
}: UserFormProps) => {
  const { t } = useTranslation();
  const validationSchema = () => {
    return getValidationSchema();
  };
  const [userValues, setUserValues] = useState(initialValues);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { data: permissionsData } = useGetAllPermissions();
  const [updatedPermissions, setUpdatedPermissions] = useState<string[]>([]);
  const [codePermissions, setCodePermissions] = useState<string[]>([]);
  const [isTreeModified, setIsTreeModified] = useState(false);
  const { data: rolesData, refetch: refetchRoles } = useGetAllRoles();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cancelRef = useRef(null);
  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };
  const { data: permissions, refetch } = useUserPermissions(userId);
  const { mutate, isLoading, isSuccess, isError, mutateAsync } = useUpdateUser(
    userId,
    userValues
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isOpen) {
      refetch();
      refetchRoles();
    }
    const newCodePermissions: string[] = [];
    permissions?.permissions?.forEach((perm) => {
      newCodePermissions.push(perm.code);
      perm.children?.forEach((child) => {
        newCodePermissions.push(child.code);
      });
    });
    setCodePermissions(newCodePermissions);
  }, [isOpen, refetch, permissions, refetchRoles]);

  const handleSubmit = async (values: ModalUserParams) => {
    // Kiểm tra password
    if (values.password !== undefined && values.password !== passwordConfirm) {
      setPasswordError(t('USER_MANAGEMENT_PAGE.PASSWORDS_DO_NOT_MATCH'));
      return;
    } else {
      setPasswordError('');
    }

    // Lấy danh sách permissions cần submit
    const permissionsToSubmit = isTreeModified
      ? updatedPermissions
      : codePermissions;

    // Xử lý roleNames
    const roleNamesArray = Array.isArray(formik.values.roleNames)
      ? formik.values.roleNames
      : formik.values.roleNames.split(',').map((role) => role.trim());

    const updatedValues = {
      ...values,
      customPermissionCodes: permissionsToSubmit,
      roleNames: roleNamesArray,
    };

    setUserValues(updatedValues);
    if (currentUser.sub[0] === userId) {
      setIsDialogOpen(true);
    } else {
      await mutate();
    }
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
        toast({
          title: t('USER_MANAGEMENT_PAGE.UPDATED_SUCCESSFULLY'),
          status: 'success',
        });
      } else if (isError) {
        toast({
          title: t('USER_MANAGEMENT_PAGE.UPDATE_FAILED'),
          status: 'error',
        });
      }
    };
    handleUpdateResult();
  }, [isSuccess, isError, onClose, queryClient, userId, t]);

  const handleChangeCheckbox = (field: string, value: boolean | string[]) => {
    formik.setFieldValue(field, value);
  };

  const handleChangeRolesCheckbox = (roleName: string, checked: boolean) => {
    const currentRoleNames = Array.isArray(formik.values.roleNames)
      ? formik.values.roleNames
      : [];
    if (checked) {
      if (!currentRoleNames.includes(roleName)) {
        handleChangeCheckbox('roleNames', [...currentRoleNames, roleName]);
      }
    } else {
      const updatedRoles = currentRoleNames.filter((role) => role !== roleName);
      handleChangeCheckbox('roleNames', updatedRoles);
    }
  };

  const renderCheckbox = (role: string, index: number) => {
    const roleNamesArray = Array.isArray(formik.values.roleNames)
      ? formik.values.roleNames
      : formik.values.roleNames.split(',').map((role) => role.trim());
    return (
      <Checkbox
        key={index}
        colorScheme="gray"
        isChecked={roleNamesArray?.some((r) => r === role)}
        onChange={(e) => handleChangeRolesCheckbox(role, e.target.checked)}
      >
        {convertToCase(role)}
      </Checkbox>
    );
  };

  const handlePermissionChange = (updatedSelection: string[]) => {
    setUpdatedPermissions(updatedSelection);
    setIsTreeModified(true);
  };

  const handleLogoutAndNavigate = async (logoutConfirmed: boolean) => {
    setIsDialogOpen(false);
    if (logoutConfirmed) {
      await mutateAsync();
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }, 500);
    }
  };

  return (
    <>
      <Tabs size="md" variant="enclosed">
        <TabList>
          <Tab fontSize="16px" fontWeight="medium">
            {t('USER_MANAGEMENT_PAGE.USER_INFORMATION')}
          </Tab>
          <Tab fontSize="16px" fontWeight="medium">
            {t('USER_MANAGEMENT_PAGE.ROLES')}
          </Tab>
          {/*<Tab fontSize="16px" fontWeight="medium">
          Permissions
        </Tab>*/}
        </TabList>
        <form onSubmit={formik.handleSubmit}>
          <TabPanels>
            <TabPanel p="0" mt="5">
              <TextField
                h="10"
                isRequired
                label={t('USER_MANAGEMENT_PAGE.USER_NAME')}
                placeholder={t('USER_MANAGEMENT_PAGE.USER_NAME')}
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
                label={t('USER_MANAGEMENT_PAGE.NAME')}
                placeholder={t('USER_MANAGEMENT_PAGE.NAME')}
                fontSize={15}
                error={formik.errors.name}
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              <PasswordField
                h="10"
                label={t('USER_MANAGEMENT_PAGE.PASSWORD')}
                placeholder={t('USER_MANAGEMENT_PAGE.PASSWORD')}
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
                label={t('USER_MANAGEMENT_PAGE.CONFIRM_PASSWORD')}
                placeholder={t('USER_MANAGEMENT_PAGE.CONFIRM_PASSWORD')}
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
                label={t('USER_MANAGEMENT_PAGE.EMAIL_ADDRESS')}
                placeholder={t('USER_MANAGEMENT_PAGE.EMAIL_ADDRESS')}
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
                label={t('USER_MANAGEMENT_PAGE.PHONE_NUMBER')}
                placeholder={t('USER_MANAGEMENT_PAGE.PHONE_NUMBER')}
                fontSize={15}
                error={formik.errors.phoneNumber}
                name="phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
              />
              <TextField
                h="10"
                label={t('USER_MANAGEMENT_PAGE.MEZON_USER_ID')}
                placeholder={t('USER_MANAGEMENT_PAGE.MEZON_USER_ID')}
                fontSize={15}
                error={formik.errors.mezonUserId}
                name="mezonUserId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mezonUserId}
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
                  {t('USER_MANAGEMENT_PAGE.ACTIVE')}
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
                  {t('USER_MANAGEMENT_PAGE.LOCK_ACCOUNT_AFTER_FAILED_LOGIN')}
                </Checkbox>
              </Stack>
            </TabPanel>
            <TabPanel p="0">
              <Stack mt={6} mb={6} direction="column">
                {rolesData?.items?.map((role, index) =>
                  renderCheckbox(role.name, index)
                )}
              </Stack>
            </TabPanel>
            <TabPanel p="0">
              <PermissionCheckbox
                permission={
                  Array.isArray(permissionsData) ? permissionsData : []
                }
                onChange={handlePermissionChange}
                style={{ fontSize: '14px', marginTop: '20px' }}
                role={permissions ? permissions : undefined}
              />
            </TabPanel>
          </TabPanels>
          <Divider></Divider>
          <Stack mb={3} mt={5} direction="row" justifyContent="center">
            <Button colorScheme="gray" color="gray" onClick={() => onClose()}>
              {t('USER_MANAGEMENT_PAGE.CANCEL')}
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              {t('USER_MANAGEMENT_PAGE.SUBMIT')}
            </Button>
          </Stack>
        </form>
      </Tabs>
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              {t('USER_MANAGEMENT_PAGE.UPDATED_SUCCESSFULLY')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('USER_MANAGEMENT_PAGE.LOG_OUT_TO_APPLY_CHANGES')}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => handleLogoutAndNavigate(false)}
              >
                {t('USER_MANAGEMENT_PAGE.CANCEL')}
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleLogoutAndNavigate(true)}
                ml={3}
              >
                {t('USER_MANAGEMENT_PAGE.YES')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UserForm;
