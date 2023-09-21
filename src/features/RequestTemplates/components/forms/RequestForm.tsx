import { Button, Text, VStack } from '@chakra-ui/react';
import {
  useOffices,
  useUserProjects,
  useUserInfoWithBranch,
  useNewRequestWorkflow,
  useUserCurrentProject,
} from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { TextareaField } from 'common/components/TextareaField';
import { TextField } from 'common/components/TextField';
import { useForm, Controller } from 'react-hook-form';
import MultiDatePicker, { DateObject } from 'react-multi-date-picker';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './style.module.scss';

import {
  InputDefinition,
  PropertyDefinition,
  IRequestFormParams,
} from 'models/request';
import { IOffices } from 'models/office';
import { IProjects } from 'models/project';
import { ChangeEvent, useState } from 'react';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { toast } from 'common/components/StandaloneToast';
import { ErrorMessage } from '@hookform/error-message';
import { formatDate } from 'utils';

interface RequestFormProps {
  inputDefinition?: InputDefinition;
  onCloseModal: () => void;
}
type FormParams = Record<
  string,
  string | DateObject | DateObject[] | null | Date | undefined
>;

type FormParamsValue =
  | string
  | DateObject
  | DateObject[]
  | null
  | Date
  | undefined;

const RequestForm = ({ inputDefinition, onCloseModal }: RequestFormProps) => {
  const { data: offices } = useOffices();
  const { data: projects } = useUserProjects();
  const currentUser = useCurrentUser();
  const { data: userInfo } = useUserInfoWithBranch(currentUser?.email);
  const { data: userCurrentProject } = useUserCurrentProject();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formParams, setFormParams] = useState<FormParams>({});
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormParams>({
    criteriaMode: 'all',
  });
  const { mutateAsync: createMutate } = useNewRequestWorkflow();
  const formatDateForm = (date: FormParamsValue) => {
    if (date instanceof Date) {
      return formatDate(date, 'dd/MM/yyyy');
    } else {
      return date?.toString();
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);

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

    const RequestFormParams: IRequestFormParams = {
      workflowDefinitionId: inputDefinition?.workflowDefinitionId,
      input: formParamsFormatted,
    };

    await createMutate(RequestFormParams);

    setIsLoading(false);
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

  const toDisplayName = (inputName: string) => {
    return inputName.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const getOptions = (type: string) => {
    switch (type) {
      case 'OfficeList':
        return offices?.map((office: IOffices) => ({
          value: office?.code,
          label: office?.displayName,
        }));

      case 'MyProject':
        return projects?.map((project: IProjects) => ({
          value: project?.code,
          label: project?.name,
        }));
    }
  };

  const getDefaultValueSelected = (type: string, fieldname: string) => {
    switch (type) {
      case 'OfficeList':
        return formParams[fieldname] ?? userInfo?.branch;
      case 'MyProject':
        return formParams[fieldname] ?? userCurrentProject?.code;
    }
  };

  const getField = (Field: PropertyDefinition) => {
    const fieldname = Field?.name ? Field.name : '';
    switch (Field?.type) {
      case 'OfficeList':
      case 'MyProject':
        formParams[fieldname] = getDefaultValueSelected(Field?.type, fieldname);
        return (
          <>
            <Text whiteSpace="nowrap" fontSize="md">
              {toDisplayName(fieldname)}
              {Field?.isRequired ? (
                <span style={{ color: 'red' }}> *</span>
              ) : (
                ''
              )}
            </Text>
            <SelectField
              size="sm"
              rounded="md"
              options={getOptions(Field?.type) ?? [{ value: '', label: '' }]}
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
              render={({ message }) => (
                <span style={{ color: 'red' }}>{message}</span>
              )}
            />
          </>
        );
      case 'Text':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <>
            <Text whiteSpace="nowrap" fontSize="md">
              {toDisplayName(fieldname)}
              {Field?.isRequired ? (
                <span style={{ color: 'red' }}> *</span>
              ) : (
                ''
              )}
            </Text>
            <TextField
              h="50px"
              placeholder={fieldname}
              fontSize="sm"
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
              render={({ message }) => (
                <span style={{ color: 'red' }}>{message}</span>
              )}
            />
          </>
        );
      case 'RichText':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <>
            <Text whiteSpace="nowrap" fontSize="md">
              {toDisplayName(fieldname)}
              {Field?.isRequired ? (
                <span style={{ color: 'red' }}> *</span>
              ) : (
                ''
              )}
            </Text>
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
              render={({ message }) => (
                <span style={{ color: 'red' }}>{message}</span>
              )}
            />
          </>
        );
      case 'DateTime':
        formParams[fieldname] = formParams[fieldname] ?? '';
        if (fieldname != 'Dates')
          return (
            <>
              <Text whiteSpace="nowrap" fontSize="md">
                {toDisplayName(fieldname)}
                {Field?.isRequired ? (
                  <span style={{ color: 'red' }}> *</span>
                ) : (
                  ''
                )}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: Field?.isRequired
                    ? `${fieldname} is Required`
                    : false,
                }}
                name={fieldname}
                render={({ field }) => {
                  formParams[fieldname] = field.value;
                  return (
                    <DatePicker
                      className={styles.datePicker}
                      onChange={field.onChange}
                      selected={field.value as Date}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName={styles.wrapperCustom}
                    />
                  );
                }}
              />
              <ErrorMessage
                errors={errors}
                name={fieldname}
                render={({ message }) => (
                  <span style={{ color: 'red' }}>{message}</span>
                )}
              />
            </>
          );
        else
          return (
            <>
              <Text whiteSpace="nowrap" fontSize="md">
                {toDisplayName(fieldname)}
                {Field?.isRequired ? (
                  <span style={{ color: 'red' }}> *</span>
                ) : (
                  ''
                )}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: Field?.isRequired
                    ? `${fieldname} is Required`
                    : false,
                }}
                name={fieldname}
                render={({ field }) => {
                  formParams[fieldname] = field.value;
                  return (
                    <MultiDatePicker
                      multiple
                      onChange={field.onChange}
                      value={field.value}
                      format="DD/MM/YYYY"
                      plugins={[<Toolbar position="bottom" sort={['close']} />]}
                      inputClass={styles.multiDatePicker}
                      containerStyle={{ width: '100%' }}
                    />
                  );
                }}
              />
              <ErrorMessage
                errors={errors}
                name={fieldname}
                render={({ message }) => (
                  <span style={{ color: 'red' }}>{message}</span>
                )}
              />
            </>
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
          h="50px"
          type="submit"
          isLoading={isLoading}
          colorScheme="blackButton"
          w="full"
          textColor="white"
        >
          Save
        </Button>
      </VStack>
    </form>
  );
};

export default RequestForm;
