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
  ESettingError,
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
import { HttpStatusCode } from 'axios';
import { Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';

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
        ? JSON.parse(data?.value ?? '{}').items
        : []) as ISettingValue[],
    [data]
  );
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const columnHelper = createColumnHelper<ISettingValue>();
  const { hasPermission } = useUserPermissions();

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
          description: ESettingError.UPDATE_SUCCESSFULLY,
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
            description: ESettingError.CREATE_SUCCESSFULLY,
            status: 'success',
          });
          formik.resetForm();
          isUpdateStatus && setIsUpdateStatus(false);
        })
        .catch((err) => {
          if (err.response.data.error.code == HttpStatusCode.Conflict)
            formik.setFieldError('code', ESettingError.CODE_ALREADY_EXIST);
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
          description: ESettingError.DELETE_SUCCESSFULLY,
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
        size: 300,
        header: () => <Box>Name</Box>,
        enableSorting: false,
        sortDescFirst: true,
        cell: (info) => <Box>{info.getValue()}</Box>,
      }),
      columnHelper.accessor('code', {
        id: 'code',
        size: 300,
        header: 'Code',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('email', {
        id: 'email',
        size: 300,
        header: 'Email',
        enableSorting: false,
        cell: (info) => info.getValue(),
      }),
      ...(hasPermission(Permissions.UPDATE_SETTINGS) ||
      hasPermission(Permissions.DELETE_SETTINGS)
        ? [
            columnHelper.display({
              id: 'actions',
              enableSorting: false,
              size: 100,
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
          ]
        : []),
    ] as ColumnDef<ISettingValue>[];
  }, [columnHelper, deleteMutate, formik, refetch, hasPermission]);

  return (
    <>
      <Box fontSize="14" fontWeight="bold">
        GDVP Group
      </Box>
      <Box fontSize="14" fontWeight="bold">
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
            p={{ base: '10px 0px 24px 0px' }}
            overflowX={'auto'}
            w={{
              base: `calc(100vw - ${sideBarWidth}px)`,
              lg: `calc(100vw - ${sideBarWidth}px)`,
              xs: 'max-content',
            }}
            data-testid="director-group-settings-view"
          >
            <Table
              columns={userColumns}
              data={settings}
              isLoading={isLoading}
              isHighlight={true}
              onRowHover={true}
              dataTestId="director-group-setting-item"
            />
          </Box>
        </EmptyWrapper>
      </Box>
    </>
  );
};
