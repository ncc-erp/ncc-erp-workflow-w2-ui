import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Box, Center } from '@chakra-ui/react';
import { Table } from 'common/components/Table/Table';
import { EmptyWrapper } from 'common/components/EmptyWrapper';
import { useRecoilValue } from 'recoil';
import { appConfigState } from 'stores/appConfig';
import { UserIdentity } from 'models/userIdentity';
import { RowAction } from './RowAction';
import { useMemo } from 'react';
import {
  ESettingCode,
  IFilterSettingParams,
  ISettingPayload,
  ISettingValue,
} from 'models/settings';
import { useFormik } from 'formik';
import { validationSettingForm } from 'utils/validationSchema';
import {
  useCreateSetting,
  useDeleteSetting,
  useGetSettingList,
} from 'api/apiHooks/settingHooks';
import QueryString from 'qs';
import { toast } from 'common/components/StandaloneToast';
import { SettingForm } from './SettingForm';

const initialFilter: IFilterSettingParams = {
  settingCode: ESettingCode.HPM,
};

const initialValues = {
  email: '',
};

export const HPMSettings = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading, refetch } = useGetSettingList(initialFilter);

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
  const columnHelper = createColumnHelper<UserIdentity>();

  const handleSubmit = async ({ email }: ISettingValue) => {
    if (isCreating) return;
    const errors = await formik.validateForm();

    if (Object.keys(errors).length) {
      return;
    }

    const payload: ISettingPayload = {
      email,
      settingCode: ESettingCode.HPM,
    };

    await createMutate(payload)
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
    const handleDeleteSetting = async ({ email }: ISettingValue) => {
      const payload: ISettingPayload = {
        email,
        settingCode: ESettingCode.HPM,
      };

      await deleteMutate(QueryString.stringify(payload)).then(() => {
        refetch();
        toast({
          description: 'Delete setting Successfully',
          status: 'success',
        });
      });
    };
    const onAction =
      (setting: ISettingValue, type: 'Edit' | 'Delete') => () => {
        switch (type) {
          case 'Delete':
            handleDeleteSetting(setting);
            break;
          case 'Edit':
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
        size: 50,
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
        HPM Group
      </Box>
      <Box p="0px 24px" fontSize="14" fontWeight="bold">
        <SettingForm
          formik={formik}
          isLoading={isLoading}
          isCreating={isCreating}
          settingCode={ESettingCode.HPM}
        ></SettingForm>
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
            data-testid="hpm-group-settings-view"
          >
            <Table
              columns={userColumns}
              data={settings}
              isLoading={isLoading}
              isHighlight={true}
              onRowHover={true}
              dataTestId="hpm-group-setting-item"
            />
          </Box>
        </EmptyWrapper>
      </Box>
    </>
  );
};
