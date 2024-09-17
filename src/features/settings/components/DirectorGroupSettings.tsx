import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Box, Center } from '@chakra-ui/react';
import { Table } from 'common/components/Table/Table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { RowAction } from './RowAction';
import { useMemo, useState } from 'react';
import {
  ESettingCode,
  IFilterSettingParams,
  ISettingPayload,
  ISettingValue,
} from 'models/settings';
import { useFormik } from 'formik';
import { validationDirectorSettingForm } from 'utils/validationSchema';
import {
  useCreateSetting,
  useDeleteSetting,
  useGetSettingList,
  useUpdateSetting,
} from 'api/apiHooks/settingHooks';
import { toast } from 'common/components/StandaloneToast';
import QueryString from 'qs';
import { SettingForm } from './SettingForm';

const initialFilter: IFilterSettingParams = {
  settingCode: ESettingCode.DIRECTOR,
};

const initialValues: ISettingValue = {
  code: '',
  name: '',
  email: '',
};

export const DirectorSettings = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading, refetch } = useGetSettingList(initialFilter);
  const [updateSetting, setUpdateSetting] = useState({ ...initialValues });
  const { mutateAsync: updateMutate } = useUpdateSetting({
    ...updateSetting,
    settingCode: ESettingCode.DIRECTOR,
  });
  const { mutateAsync: createMutate, isLoading: isCreating } =
    useCreateSetting();
  const { mutateAsync: deleteMutate } = useDeleteSetting();
  const settings = useMemo(
    () =>
      (data?.value
        ? JSON.parse(data?.value ?? {}).items
        : []) as ISettingValue[],
    [data]
  );
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const columnHelper = createColumnHelper<ISettingValue>();

  const handleSubmit = async ({ email, code, name }: ISettingValue) => {
    if (isCreating) return;
    const errors = await formik.validateForm();

    if (Object.keys(errors).length) {
      return;
    }

    const payload: ISettingPayload = {
      email,
      code,
      name,
      settingCode: ESettingCode.DIRECTOR,
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
            formik.setFieldError('code', 'This code already exist.');
        });
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    isUpdateStatus && setIsUpdateStatus(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationDirectorSettingForm,
    onSubmit: handleSubmit,
  });

  const userColumns = useMemo(() => {
    const handleDeleteSetting = async ({ code }: ISettingValue) => {
      const payload: ISettingPayload = {
        code,
        settingCode: ESettingCode.DIRECTOR,
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
        size: 50,
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
        GDVP Group
      </Box>
      <Box p="0px 24px" fontSize="14" fontWeight="bold">
        <SettingForm
          formik={formik}
          isLoading={isLoading}
          isCreating={isCreating}
          settingCode={ESettingCode.DIRECTOR}
          isUpdateStatus={isUpdateStatus}
          handleCancel={handleCancel}
        ></SettingForm>
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