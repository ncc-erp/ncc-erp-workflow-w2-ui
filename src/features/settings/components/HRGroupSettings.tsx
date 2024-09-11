import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Table } from 'common/components/Table/Table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { UserIdentity } from 'models/userIdentity';
import { RowAction } from './RowAction';
import { useMemo } from 'react';
import {
  ESettingCode,
  FilterSettingParams,
  ISettingPayload,
  ISettingValue,
} from 'models/settings';
import { TextField } from 'common/components/TextField';
import { useFormik } from 'formik';
import { validationSettingForm } from 'utils/validationSchema';
import {
  useCreateSetting,
  useDeleteSetting,
  useGetSettingList,
} from 'api/apiHooks/settingHooks';
import QueryString from 'qs';
import { toast } from 'common/components/StandaloneToast';

const initialFilter: FilterSettingParams = {
  settingCode: ESettingCode.HR,
};

const initialValues = {
  email: '',
};

export const HRSettings = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading, refetch } = useGetSettingList(initialFilter);

  const { mutateAsync: createMutate, isLoading: isCreating } =
    useCreateSetting();
  const { mutateAsync: deleteMutate } = useDeleteSetting();
  const settings = (
    data && data?.value ? JSON.parse(data?.value ?? '').items : []
  ) as ISettingValue[];
  const columnHelper = createColumnHelper<UserIdentity>();

  const handleSubmit = async (settingData: ISettingValue) => {
    if (isCreating) return;
    const errors = await formik.validateForm();

    if (Object.keys(errors).length) {
      formik.setFieldTouched('email');
      return;
    }

    const payload: ISettingPayload = {
      email: settingData.email,
      settingCode: ESettingCode.HR,
    };

    await createMutate({
      email: payload.email,
      settingCode: payload.settingCode,
    })
      .then(() => {
        refetch();
        toast({
          description: 'Create setting Successfully',
          status: 'success',
        });
        formik.resetForm();
      })
      .catch((err) => {
        if (err.response.data.error.code === '409')
          formik.setFieldError('email', 'This email is already in use');
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSettingForm,
    onSubmit: handleSubmit,
  });

  const userColumns = useMemo(() => {
    const handleDeleteSetting = async (settingData: ISettingValue) => {
      const payload: ISettingPayload = {
        email: settingData.email,
        settingCode: ESettingCode.HR,
      };

      await deleteMutate(QueryString.stringify(payload)).then(() => {
        refetch();
        toast({
          description: 'Delete setting Successfully',
          status: 'success',
        });
      });
    };
    const onAction = (setting: ISettingValue, type: 'Delete') => () => {
      switch (type) {
        case 'Delete':
          handleDeleteSetting(setting);
          break;

        default:
          break;
      }
    };
    return [
      columnHelper.accessor('email', {
        id: 'email',
        header: 'Email',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        enableSorting: false,
        header: () => <Center w="full">Actions</Center>,
        cell: (info) => (
          <Center>
            <RowAction onDelete={onAction(info.row.original, 'Delete')} />
          </Center>
        ),
      }),
    ] as ColumnDef<ISettingValue>[];
  }, [columnHelper, deleteMutate, refetch]);

  return (
    <>
      <Box p="0px 24px" fontSize="14" fontWeight="bold">
        HR Group
      </Box>
      <Box p="0px 24px" fontSize="14" fontWeight="bold">
        <form onSubmit={formik.handleSubmit}>
          <Flex gap="4" alignItems="flex-end">
            <TextField
              h="10"
              mb={formik.errors.email && formik.touched.email ? '0' : '26px'}
              label="Email"
              placeholder="HR email"
              isRequired
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
            <Button
              size={'md'}
              mb="26px"
              colorScheme="green"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(formik.values);
              }}
              fontSize="sm"
              fontWeight="medium"
              minW="70"
              isLoading={isLoading}
            >
              Add
            </Button>
          </Flex>
        </form>
      </Box>
      <Box>
        <EmptyWrapper
          isEmpty={!settings.length && !isLoading}
          h="200px"
          fontSize="xs"
          message={'No request found!'}
        >
          <Box
            p={{ base: '10px 24px 24px 24px' }}
            overflowX={'auto'}
            w={{
              base: `calc(100vw - ${sideBarWidth}px)`,
              lg: `calc(100vw - ${sideBarWidth}px)`,
              xs: 'max-content',
            }}
          >
            <Table
              columns={userColumns}
              data={settings}
              isLoading={isLoading}
            />
          </Box>
        </EmptyWrapper>
      </Box>
    </>
  );
};
