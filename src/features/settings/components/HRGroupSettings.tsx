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
import { HttpStatusCode } from 'axios';
import { Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useTranslation } from 'react-i18next';

const initialFilter: IFilterSettingParams = {
  settingCode: ESettingCode.HR,
};

const initialValues = {
  email: '',
};

export const HRSettings = () => {
  const { t } = useTranslation();
  const { sideBarWidth } = useRecoilValue(appConfigState);
  const { data, isLoading, refetch } = useGetSettingList(initialFilter);
  const { hasPermission } = useUserPermissions();

  const { mutateAsync: createMutate, isLoading: isCreating } =
    useCreateSetting();
  const { mutateAsync: deleteMutate } = useDeleteSetting();
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
      settingCode: ESettingCode.HR,
    };

    await createMutate(payload)
      .then(() => {
        refetch();
        toast({
          description: t('SETTING_PAGE.CREATE_SUCCESS'),
          status: 'success',
        });
        formik.resetForm();
      })
      .catch((err) => {
        if (err.response.data.error.code == HttpStatusCode.Conflict)
          formik.setFieldError('email', t('SETTING_PAGE.EMAIL_ALREADY_EXISTS'));
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
        settingCode: ESettingCode.HR,
      };

      await deleteMutate(QueryString.stringify(payload)).then(() => {
        refetch();
        toast({
          description: t('SETTING_PAGE.DELETE_SUCCESS'),
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
        header: t('SETTING_PAGE.EMAIL'),
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      ...(hasPermission(Permissions.DELETE_SETTINGS)
        ? [
            columnHelper.display({
              id: 'actions',
              size: 50,
              enableSorting: false,
              header: () => (
                <Center w="full">{t('SETTING_PAGE.ACTIONS')}</Center>
              ),
              cell: (info) => (
                <Center>
                  <RowAction onDelete={onAction(info.row.original, 'Delete')} />
                </Center>
              ),
            }),
          ]
        : []),
    ] as ColumnDef<ISettingValue>[];
  }, [columnHelper, deleteMutate, refetch, hasPermission, t]);

  return (
    <>
      <Box fontSize="14" fontWeight="bold">
        {t('SETTING_PAGE.HR_GROUP')}
      </Box>
      <Box fontSize="14" fontWeight="bold">
        <SettingForm
          formik={formik}
          isLoading={isLoading}
          isCreating={isCreating}
          settingCode={ESettingCode.HR}
        ></SettingForm>
      </Box>
      <Box>
        <EmptyWrapper
          isEmpty={!settings.length && !isLoading}
          h="200px"
          fontSize="xs"
          message={t('SETTING_PAGE.NO_REQUEST_FOUND')}
        >
          <Box
            p={{ base: '10px 0px 24px 0px' }}
            overflowX={'auto'}
            w={{
              base: `calc(100vw - ${sideBarWidth}px)`,
              lg: `calc(100vw - ${sideBarWidth}px)`,
              xs: 'max-content',
            }}
            data-testid="hr-group-settings-view"
          >
            <Table
              columns={userColumns}
              data={settings}
              isLoading={isLoading}
              isHighlight={true}
              onRowHover={true}
              dataTestId="hr-group-setting-item"
            />
          </Box>
        </EmptyWrapper>
      </Box>
    </>
  );
};
