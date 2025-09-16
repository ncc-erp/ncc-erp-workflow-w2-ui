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
  ESettingError,
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
import { toast } from 'common/components/StandaloneToast';
import QueryString from 'qs';
import { SettingForm } from './SettingForm';
import { HttpStatusCode } from 'axios';
import { Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';

const initialFilter: IFilterSettingParams = {
  settingCode: ESettingCode.CEO,
};

const initialValues: ISettingValue = {
  email: '',
};

export const CEOSettings = () => {
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading, refetch } = useGetSettingList(initialFilter);
  const { mutateAsync: createMutate, isLoading: isCreating } =
    useCreateSetting();
  const { mutateAsync: deleteMutate } = useDeleteSetting();
  const { hasPermission } = useUserPermissions();

  const settings = useMemo(
    () =>
      (data?.value
        ? JSON.parse(data?.value ?? '{}').items
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
      settingCode: ESettingCode.CEO,
    };

    await createMutate(payload)
      .then(() => {
        refetch();
        toast({
          description: ESettingError.CREATE_SUCCESSFULLY,
          status: 'success',
        });
        formik.resetForm();
      })
      .catch((err) => {
        if (err.response.data.error.code == HttpStatusCode.Conflict)
          formik.setFieldError('email', ESettingError.EMAIL_ALREADY_EXIST);
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
        settingCode: ESettingCode.CEO,
      };

      await deleteMutate(QueryString.stringify(payload)).then(() => {
        refetch();
        toast({
          description: ESettingError.DELETE_SUCCESSFULLY,
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
        size: 550,
        header: 'Email',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      ...(hasPermission(Permissions.DELETE_SETTINGS)
        ? [
            columnHelper.display({
              id: 'actions',
              enableSorting: false,
              size: 100,
              header: () => <Center w="full">Actions</Center>,
              cell: (info) => (
                <Center>
                  <RowAction onDelete={onAction(info.row.original, 'Delete')} />
                </Center>
              ),
            }),
          ]
        : []),
    ] as ColumnDef<ISettingValue>[];
  }, [columnHelper, deleteMutate, refetch, hasPermission]);

  return (
    <>
      <Box fontSize="14" fontWeight="bold">
        CEO Group
      </Box>
      <Box fontSize="14" fontWeight="bold">
        <SettingForm
          formik={formik}
          isLoading={isLoading}
          isCreating={isCreating}
          settingCode={ESettingCode.CEO}
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
            p={{ base: '10px 0px 24px 0px' }}
            overflowX={'auto'}
            w={{
              base: `calc(100vw - ${sideBarWidth}px)`,
              lg: `calc(100vw - ${sideBarWidth}px)`,
              xs: 'max-content',
            }}
            data-testid="ceo-group-settings-view"
          >
            <Table
              columns={userColumns}
              data={settings}
              isLoading={isLoading}
              isHighlight={true}
              onRowHover={true}
              dataTestId="ceo-group-setting-item"
            />
          </Box>
        </EmptyWrapper>
      </Box>
    </>
  );
};
