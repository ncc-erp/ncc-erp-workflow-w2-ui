import { Button, Flex } from '@chakra-ui/react';
import { TextField } from 'common/components/TextField';
import { FormikProps } from 'formik';
import { ESettingCode, ISettingValue } from 'models/settings';

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
  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex gap="4" alignItems="flex-start">
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
        />
        {isUpdateStatus && (
          <Button
            size={'md'}
            mt="46px"
            colorScheme="gray"
            onClick={(e) => {
              e.preventDefault();
              handleCancel && handleCancel();
            }}
            fontSize="sm"
            fontWeight="medium"
            minW="70"
            isLoading={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          size={'md'}
          mt="46px"
          colorScheme="green"
          type="submit"
          fontSize="sm"
          fontWeight="medium"
          minW="70"
          isLoading={isLoading || isCreating}
        >
          {isUpdateStatus ? 'Edit' : 'Add'}
        </Button>
      </Flex>
    </form>
  );
};
