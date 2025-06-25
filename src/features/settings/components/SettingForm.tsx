import { Button, Flex } from '@chakra-ui/react';
import { TextField } from 'common/components/TextField';
import { Permissions } from 'common/constants';
import { FormikProps } from 'formik';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { ESettingCode, ISettingValue } from 'models/settings';
import { BiPlusCircle, BiSolidPencil } from 'react-icons/bi';

interface SettingFormProps {
  formik: FormikProps<ISettingValue>;
  isLoading: boolean;
  isCreating: boolean;
  settingCode: ESettingCode;
  isUpdateStatus?: boolean;
  handleCancel?: () => void;
}

export const SettingForm = ({
  formik,
  isLoading,
  isCreating,
  settingCode,
  isUpdateStatus,
  handleCancel,
}: SettingFormProps) => {
  const { renderIfAllowed } = useUserPermissions();
  return (
    <>
      {renderIfAllowed(
        Permissions.CREATE_SETTINGS,
        <form onSubmit={formik.handleSubmit}>
          <Flex
            gap={[0, 4]}
            alignItems="flex-start"
            mt="3"
            flexDirection={['column', 'row']}
          >
            {settingCode === ESettingCode.DIRECTOR && (
              <>
                <TextField
                  h="10"
                  mb={formik.errors.name && formik.touched.name ? '0' : '26px'}
                  label="Name"
                  placeholder="Name"
                  fontSize={15}
                  error={
                    formik.errors.name && formik.touched.name
                      ? formik.errors.name
                      : ''
                  }
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  autoComplete="off"
                  labelProps={{ mt: 0, mb: 2 }}
                />
                <TextField
                  h="10"
                  mb={formik.errors.code && formik.touched.code ? '0' : '26px'}
                  label="Code"
                  placeholder="Code"
                  isDisabled={isUpdateStatus}
                  fontSize={15}
                  error={
                    formik.errors.code && formik.touched.code
                      ? formik.errors.code
                      : ''
                  }
                  name="code"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.code}
                  autoComplete="off"
                  labelProps={{ mt: 0, mb: 2 }}
                />
              </>
            )}
            <TextField
              h="10"
              mb={formik.errors.email && formik.touched.email ? '0' : '26px'}
              label="Email"
              placeholder="Email"
              fontSize={15}
              error={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : ''
              }
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              autoComplete="off"
              labelProps={{ mt: 0, mb: 2 }}
            />
            {isUpdateStatus && (
              <Button
                size={'md'}
                mt={['8px', '32px']}
                colorScheme="gray"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel && handleCancel();
                }}
                fontSize="sm"
                fontWeight="medium"
                minW={['100%', '70px']}
                isLoading={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              leftIcon={
                isUpdateStatus ? (
                  <BiSolidPencil size={15} />
                ) : (
                  <BiPlusCircle size={15} />
                )
              }
              size={'md'}
              mt={['8px', '30px']}
              variant="primary"
              type="submit"
              fontSize="sm"
              fontWeight="medium"
              minW={['100%', '70px']}
              isLoading={isLoading || isCreating}
            >
              {isUpdateStatus ? 'Edit' : 'Add'}
            </Button>
          </Flex>
        </form>
      )}
    </>
  );
};
