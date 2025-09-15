import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  useNewRequestWorkflow,
  useOffices,
  useUserCurrentProject,
  useUserInfoWithBranch,
  useUserList,
  useUserProjects,
} from 'api/apiHooks/requestHooks';
import { TextareaField } from 'common/components/TextareaField';
import { TextField } from 'common/components/TextField';
import { Controller, useForm } from 'react-hook-form';
import MultiDatePicker, { DateObject } from 'react-multi-date-picker';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './style.module.scss';

import { ErrorMessage } from '@hookform/error-message';
import { ErrorDisplay } from 'common/components/ErrorDisplay';
import { SearchableSelectField } from 'common/components/SearchableSelectField';
import { toast } from 'common/components/StandaloneToast';
import { ColorThemeMode, WFH_FORMAT_DATE } from 'common/constants';
import { option } from 'common/types';
import { isWithinInterval, subWeeks } from 'date-fns';
import { useCurrentUser } from 'stores/user';
import { IOffices } from 'models/office';
import { IProjects } from 'models/project';
import {
  InputDefinition,
  IRequestFormParams,
  PropertyDefinition,
} from 'models/request';
import { IUser } from 'models/user';
import moment from 'moment';
import { ChangeEvent, useMemo, useState } from 'react';
import { NumericField } from 'common/components/NumericField';
import { convertToCase } from 'utils';
import { formatDateForm } from 'utils/dateUtils';
import { useTranslation } from 'react-i18next';

interface RequestFormProps {
  inputDefinition?: InputDefinition;
  onCloseModal: () => void;
}
export type FormParams = Record<
  string,
  string | DateObject | DateObject[] | null | Date | undefined | number
>;

const RequestForm = ({ inputDefinition, onCloseModal }: RequestFormProps) => {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const [formParams, setFormParams] = useState<FormParams>({});
  const [emailUser, setEmailUser] = useState<string>(currentUser?.email);

  const { data: users } = useUserList();
  const { data: offices } = useOffices();
  const { data: userInfo } = useUserInfoWithBranch(emailUser);
  const { data: projects } = useUserProjects(emailUser);
  const { data: userCurrentProject } = useUserCurrentProject(emailUser);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormParams>({
    criteriaMode: 'all',
  });
  const { mutateAsync: createMutate, isLoading } = useNewRequestWorkflow();
  const shortHeader: string = useMemo(() => {
    return (
      inputDefinition?.propertyDefinitions.find((item) => item.isTitle == true)
        ?.name || ''
    );
  }, [inputDefinition?.propertyDefinitions]);

  const onSubmit = async () => {
    const formParamsFormatted = { ...formParams };
    Object.keys(formParamsFormatted).forEach((key) => {
      if (
        formParamsFormatted[key] instanceof Date ||
        formParamsFormatted[key] instanceof DateObject ||
        Array.isArray(formParamsFormatted[key])
      ) {
        formParamsFormatted[key] = formatDateForm(formParamsFormatted[key]);
      }
    });

    formParamsFormatted['shortHeader'] = shortHeader;

    const RequestFormParams: IRequestFormParams = {
      workflowDefinitionId: inputDefinition?.workflowDefinitionId,
      input: formParamsFormatted,
    };

    await createMutate(RequestFormParams);
    toast({
      description: 'Create Request Successfully',
      status: 'success',
    });
    onCloseModal();
  };

  const handleChangeValue = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>,
    variable: string
  ) => {
    const updatedFormParams = { ...formParams };
    updatedFormParams[variable] = e.target.value;
    setFormParams(updatedFormParams);
  };

  const handleSelectChangeValue = (value: string, variable: string) => {
    let updatedFormParams = { ...formParams };

    if (variable == 'Staff') {
      setEmailUser(value);
      updatedFormParams = { Staff: value };
    }

    updatedFormParams[variable] = value;
    setFormParams(updatedFormParams);
  };

  const getOptions = (type: string) => {
    let transformedData: option[] = [];

    switch (type) {
      case 'OfficeList':
        transformedData = (offices ?? []).map((office: IOffices) => ({
          value: office?.code,
          label: office?.displayName,
        }));
        break;

      case 'MyProject':
        transformedData = (projects ?? []).map((project: IProjects) => ({
          value: project?.code,
          label: project?.name,
        }));
        break;

      case 'UserList': {
        transformedData = (users ?? []).map((user: IUser) => ({
          value: user?.email ?? '',
          label: `${user?.name ?? ''} (${user?.email ?? ''})`,
        }));
        break;
      }
    }

    transformedData.unshift({ value: '', label: '' });
    return transformedData;
  };

  const getDefaultValueSelected = (type: string, fieldname: string) => {
    switch (type) {
      case 'OfficeList':
        return formParams[fieldname] ?? userInfo?.branch;

      case 'MyProject':
        return formParams[fieldname] ?? userCurrentProject?.code;

      case 'UserList':
        return formParams[fieldname] ?? '';
    }
  };

  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);

  const createDateString = (value: number) => {
    if (value < 10) {
      return `0${value}`;
    } else {
      return value;
    }
  };

  const validateMultiDatePicker = (
    value: string | DateObject | Date | DateObject[] | null | undefined | number
  ) => {
    if (value && Array.isArray(value)) {
      for (const dateObject of value) {
        const day = dateObject.day;
        const month = dateObject.month.number;
        const year = dateObject.year;
        if (day === undefined || month === undefined || year === undefined) {
          return t('requestTemplates.validation.invalidDate');
        }

        const dateStr = `${year}-${createDateString(month)}-${createDateString(
          day
        )}`;
        if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
          return t('requestTemplates.validation.invalidDateFormat');
        }
        const dateToCheck = new Date(dateStr);
        const currentDate = new Date();
        const lastWeek = subWeeks(currentDate, 1);

        if (
          dateToCheck <= currentDate &&
          !isWithinInterval(dateToCheck, { start: lastWeek, end: currentDate })
        ) {
          return t('requestTemplates.validation.chooseDatesWithin7Days');
        }
      }
    }
    return true;
  };

  const getField = (Field: PropertyDefinition) => {
    const fieldname = Field?.name ? Field.name : '';
    switch (Field?.type) {
      case 'OfficeList':
      case 'MyProject':
      case 'UserList':
        formParams[fieldname] = getDefaultValueSelected(Field?.type, fieldname);
        return (
          <FormControl key={Field?.name} color={'dark'}>
            <FormLabel
              fontSize={16}
              my={1}
              fontWeight="normal"
              textColor={color}
            >
              {convertToCase(fieldname)}
              {Field?.isRequired ? (
                <FormHelperText my={1} style={{ color: 'red' }} as="span">
                  {' '}
                  *
                </FormHelperText>
              ) : (
                ''
              )}
            </FormLabel>
            <div data-testid={Field?.name}>
              <SearchableSelectField
                name={fieldname}
                control={control}
                options={
                  (getOptions(Field?.type) as Array<option>) ?? [
                    { value: '', label: '' },
                  ]
                }
                isRequired={Field?.isRequired}
                value={formParams[fieldname] as string}
                handleChange={handleSelectChangeValue}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name={fieldname}
              render={({ message }) => <ErrorDisplay message={message} />}
            />
          </FormControl>
        );

      case 'Text':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <FormControl key={Field?.name}>
            <FormLabel fontSize={16} my={1} fontWeight="normal">
              {convertToCase(fieldname)}
              {Field?.isRequired ? (
                <FormHelperText my={1} style={{ color: 'red' }} as="span">
                  {' '}
                  *
                </FormHelperText>
              ) : (
                ''
              )}
            </FormLabel>
            <TextField
              h="50px"
              placeholder={fieldname}
              fontSize="sm"
              value={formParams[fieldname] as string}
              {...register(fieldname, {
                required: Field?.isRequired
                  ? t('requestTemplates.forms.requestForm.fieldRequired', {
                      field: convertToCase(fieldname),
                    })
                  : false,
                onChange: (e) => handleChangeValue(e, fieldname),
              })}
            />
            <ErrorMessage
              errors={errors}
              name={fieldname}
              render={({ message }) => <ErrorDisplay message={message} />}
            />
          </FormControl>
        );

      case 'RichText':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <FormControl key={Field?.name}>
            <FormLabel fontSize={16} my={1} fontWeight="normal">
              {convertToCase(fieldname)}
              {Field?.isRequired ? (
                <FormHelperText my={1} style={{ color: 'red' }} as="span">
                  {' '}
                  *
                </FormHelperText>
              ) : (
                ''
              )}
            </FormLabel>
            <TextareaField
              value={formParams[fieldname] as string}
              {...register(fieldname, {
                required: Field?.isRequired
                  ? `${fieldname} is Required`
                  : false,
                onChange: (e) => handleChangeValue(e, fieldname),
              })}
            />
            <ErrorMessage
              errors={errors}
              name={fieldname}
              render={({ message }) => <ErrorDisplay message={message} />}
            />
          </FormControl>
        );

      case 'DateTime':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <FormControl key={Field?.name}>
            <FormLabel
              htmlFor={fieldname}
              fontSize={16}
              my={1}
              fontWeight="normal"
            >
              {convertToCase(fieldname)}
              {Field?.isRequired ? (
                <FormHelperText my={1} style={{ color: 'red' }} as="span">
                  {' '}
                  *
                </FormHelperText>
              ) : (
                ''
              )}
            </FormLabel>
            <Controller
              control={control}
              rules={{
                required: Field?.isRequired
                  ? t('requestTemplates.forms.requestForm.fieldRequired', {
                      field: convertToCase(
                        fieldname.replace(/([A-Z])/g, ' $1')
                      ),
                    })
                  : false,
                validate: () => {
                  const startDate = watch('StartDate');
                  const endDate = watch('EndDate');

                  if (!startDate || !endDate) {
                    return true;
                  }

                  const formatStartDate = moment(
                    startDate as string,
                    WFH_FORMAT_DATE
                  );
                  const formatEndDate = moment(
                    endDate as string,
                    WFH_FORMAT_DATE
                  );

                  if (!formatEndDate.isAfter(formatStartDate)) {
                    return `${fieldname} is Not Valid`;
                  }

                  return true;
                },
              }}
              name={fieldname}
              render={({ field }) => {
                formParams[fieldname] = field.value;
                return (
                  <div data-testid={Field?.name}>
                    <DatePicker
                      id={fieldname}
                      autoComplete="off"
                      className={styles.datePicker}
                      onChange={field.onChange}
                      selected={field.value as Date}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName={styles.wrapperCustom}
                      popperModifiers={[
                        {
                          name: 'arrow',
                          options: {
                            padding: ({ popper }) => ({
                              right: popper.width - 32,
                            }),
                          },
                        },
                      ]}
                    />
                  </div>
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name={fieldname}
              render={({ message }) => <ErrorDisplay message={message} />}
            />
          </FormControl>
        );

      case 'MultiDatetime':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <FormControl key={Field?.name}>
            <FormLabel my={1} fontSize={16} fontWeight="normal">
              {convertToCase(fieldname)}
              {Field?.isRequired ? (
                <FormHelperText my={1} style={{ color: 'red' }} as="span">
                  {' '}
                  *
                </FormHelperText>
              ) : (
                ''
              )}
            </FormLabel>
            <Controller
              control={control}
              rules={{
                required: Field?.isRequired
                  ? t('requestTemplates.forms.requestForm.fieldRequired', {
                      field: convertToCase(fieldname),
                    })
                  : false,
                validate: validateMultiDatePicker,
              }}
              name={fieldname}
              render={({ field }) => {
                formParams[fieldname] = field.value;
                return (
                  <div data-testid={Field?.name}>
                    <MultiDatePicker
                      multiple
                      onChange={field.onChange}
                      value={field.value}
                      format="DD/MM/YYYY"
                      plugins={[<Toolbar position="bottom" sort={['close']} />]}
                      inputClass={styles.multiDatePicker}
                      containerStyle={{ width: '100%' }}
                    />
                  </div>
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name={fieldname}
              render={({ message }) => <ErrorDisplay message={message} />}
            />
          </FormControl>
        );

      case 'Numeric':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <FormControl key={Field?.name}>
            <FormLabel fontSize={16} my={1} fontWeight="normal">
              {convertToCase(fieldname)}
              {Field?.isRequired ? (
                <FormHelperText my={1} style={{ color: 'red' }} as="span">
                  {' '}
                  *
                </FormHelperText>
              ) : (
                ''
              )}
            </FormLabel>
            <NumericField
              h="50px"
              placeholder={fieldname}
              fontSize="sm"
              value={formParams[fieldname] as string}
              {...register(fieldname, {
                required: Field?.isRequired
                  ? t('requestTemplates.forms.requestForm.fieldRequired', {
                      field: convertToCase(fieldname),
                    })
                  : false,
                onChange: (e) => handleChangeValue(e, fieldname),
              })}
            />
            <ErrorMessage
              errors={errors}
              name={fieldname}
              render={({ message }) => <ErrorDisplay message={message} />}
            />
          </FormControl>
        );
    }
  };

  const renderFormContent = (Fields: PropertyDefinition[] | undefined) => {
    return Fields?.map(function (Field: PropertyDefinition) {
      return getField(Field);
    });
  };

  return (
    <form
      style={{ width: '100%', marginBottom: '20px' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack spacing="14px" alignItems="flex-start">
        {renderFormContent(inputDefinition?.propertyDefinitions)}
        <Button
          mt="14px"
          size="full"
          type="submit"
          isLoading={isLoading}
          colorScheme="gray"
        >
          {t('common.save')}
        </Button>
      </VStack>
    </form>
  );
};

export default RequestForm;
