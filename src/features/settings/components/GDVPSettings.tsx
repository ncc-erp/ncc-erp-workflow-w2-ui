import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Table } from 'common/components/Table/Table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { RowAction } from './RowAction';
import { useMemo, useState } from 'react';
import {
  ESettingCode,
  FilterSettingParams,
  ISettingPayload,
  ISettingValue,
} from 'models/settings';
import { TextField } from 'common/components/TextField';
import { useFormik } from 'formik';
import { validationGDVPSettingForm } from 'utils/validationSchema';
import {
  useCreateSetting,
  useDeleteSetting,
  useGetSettingList,
  useUpdateSetting,
} from 'api/apiHooks/settingHooks';
import { toast } from 'common/components/StandaloneToast';
import QueryString from 'qs';

const initialFilter: FilterSettingParams = {
  settingCode: ESettingCode.GDVP,
};

const initialValues: ISettingValue = {
  code: '',
  name: '',
  email: '',
};

export const GDVPSettings = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading, refetch } = useGetSettingList(initialFilter);
  const [updateSetting, setUpdateSetting] = useState({ ...initialValues });
  const { mutateAsync: updateMutate } = useUpdateSetting({
    ...updateSetting,
    settingCode: ESettingCode.GDVP,
  });
  const { mutateAsync: createMutate, isLoading: isCreating } =
    useCreateSetting();
  const { mutateAsync: deleteMutate } = useDeleteSetting();
  const settings = useMemo(
    () => (data ? JSON.parse(data?.value ?? '').items : []) as ISettingValue[],
    [data]
  );
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const columnHelper = createColumnHelper<ISettingValue>();

  const handleSubmit = async (settingData: ISettingValue) => {
    if (isCreating) return;
    const errors = await formik.validateForm();

    if (Object.keys(errors).length) {
      formik.setFieldTouched('email');
      formik.setFieldTouched('code');
      formik.setFieldTouched('name');
      return;
    }

    const payload: ISettingPayload = {
      email: settingData.email,
      code: settingData.code,
      name: settingData.name,
      settingCode: ESettingCode.GDVP,
    };

    if (isUpdateStatus) {
      setUpdateSetting(payload);
      await updateMutate().then(() => {
        refetch();
        toast({
          description: 'Update setting Successfully',
          status: 'success',
        });
        setUpdateSetting(initialValues);
        formik.resetForm();
        isUpdateStatus && setIsUpdateStatus(false);
      });
    } else {
      await createMutate(payload)
        .then(() => {
          refetch();
          toast({
            description: 'Create setting Successfully',
            status: 'success',
          });
          formik.resetForm();
          isUpdateStatus && setIsUpdateStatus(false);
        })
        .catch((err) => {
          if (err.response.data.error.code === '409')
            formik.setFieldError('code', 'Please enter a unique code.');
        });
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    isUpdateStatus && setIsUpdateStatus(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationGDVPSettingForm,
    onSubmit: handleSubmit,
  });

  const userColumns = useMemo(() => {
    const handleDeleteSetting = async (settingData: ISettingValue) => {
      const payload: ISettingPayload = {
        code: settingData.code,
        settingCode: ESettingCode.GDVP,
      };

      await deleteMutate(QueryString.stringify(payload)).then(() => {
        refetch();
        toast({
          description: 'Delete setting Successfully',
          status: 'success',
        });
      });
    };
    const handleFillEditData = (setting: ISettingValue) => {
      formik.setValues(setting);
      setIsUpdateStatus(true);
    };
    const onAction =
      (setting: ISettingValue, type: 'Edit' | 'Delete') => () => {
        switch (type) {
          case 'Edit':
            handleFillEditData(setting);
            break;

          case 'Delete':
            handleDeleteSetting(setting);
            break;

          default:
            break;
        }
      };
    return [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => <Box>Name</Box>,
        enableSorting: false,
        sortDescFirst: true,
        cell: (info) => <Box>{info.getValue()}</Box>,
      }),
      columnHelper.accessor('code', {
        id: 'code',
        header: 'Code',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
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
            <RowAction
              onEdit={onAction(info.row.original, 'Edit')}
              onDelete={onAction(info.row.original, 'Delete')}
              disableDeleteButton={
                info.row.original.code === formik.values.code
              }
            />
          </Center>
        ),
      }),
    ] as ColumnDef<ISettingValue>[];
  }, [columnHelper, deleteMutate, formik, refetch]);

  return (
    <>
      <Box p="0px 24px" fontSize="14" fontWeight="bold">
        GDVP config
      </Box>
      <Box p="0px 24px" fontSize="14" fontWeight="bold">
        <form>
          <Flex gap="4" alignItems="flex-start">
            <TextField
              h="10"
              mb={formik.errors.name && formik.touched.name ? '0' : '26px'}
              label="Name"
              placeholder="GDVP Name"
              isRequired
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
              placeholder="GDVP Code"
              isRequired
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
            <TextField
              h="10"
              mb={formik.errors.email && formik.touched.email ? '0' : '26px'}
              label="Email"
              placeholder="GDVP email"
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
            {isUpdateStatus && (
              <Button
                size={'md'}
                mb="26px"
                colorScheme="gray"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel();
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
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(formik.values);
              }}
              fontSize="sm"
              fontWeight="medium"
              minW="70"
              isLoading={isLoading}
            >
              {isUpdateStatus ? 'Edit' : 'Add'}
            </Button>
          </Flex>
        </form>
      </Box>
      <Box>
        <EmptyWrapper
          isEmpty={!settings?.length && !isLoading}
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
