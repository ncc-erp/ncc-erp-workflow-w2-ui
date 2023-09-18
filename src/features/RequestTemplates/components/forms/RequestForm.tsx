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
import { useForm } from 'react-hook-form';
import MultiDatePicker, { DateObject } from 'react-multi-date-picker';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import {
  InputDefinition,
  PropertyDefinition,
  IRequestFormParams,
} from 'models/request';
import { IOffices } from 'models/office';
import { IProjects } from 'models/project';
import { ChangeEvent, useState } from 'react';
import { format } from 'date-fns/esm';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { toast } from 'common/components/StandaloneToast';

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
  const { data: userInfo } = useUserInfoWithBranch(currentUser.email);
  const { data: userCurrentProject } = useUserCurrentProject();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formParams, setFormParams] = useState<FormParams>({});
  const { handleSubmit } = useForm<FormParams>({});
  const requiredFields: Array<string> = [];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: createMutate } = useNewRequestWorkflow();
  const formatDate = (date: FormParamsValue) => {
    if (date instanceof Date) {
      return format(date, 'yyyy/MM/dd');
    } else {
      return date?.toString();
    }
  };

  const validateValue = async () => {
    const fieldErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (
        !formParams[field] ||
        (formParams[field] as Array<DateObject>)?.length == 0
      ) {
        fieldErrors[field] = `${field} is required!`;
      }
    });
    return fieldErrors;
  };

  const onSubmit = async () => {
    setIsLoading(true);

    setErrors({});
    const fieldErrors = await validateValue();
    if (Object.keys(fieldErrors).length) {
      setIsLoading(false);
      setErrors(fieldErrors);
      return;
    }

    const formParamsFormatted = { ...formParams };
    Object.keys(formParamsFormatted).forEach((key) => {
      if (
        formParamsFormatted[key] instanceof Date ||
        formParamsFormatted[key] instanceof DateObject ||
        Array.isArray(formParamsFormatted[key])
      ) {
        formParamsFormatted[key] = formatDate(formParamsFormatted[key]);
      }
    });

    const RequestFormParams: IRequestFormParams = {
      workflowDefinitionId: inputDefinition?.workflowDefinitionId,
      input: formParamsFormatted,
    };

    const { result } = await createMutate(RequestFormParams);
    setIsLoading(false);
    console.log(result);
    toast({
      description: 'Create Request Successfully',
      status: 'success',
    });
    onCloseModal();
  };

  const handleChangeValue = (
    e:
      | ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
      | Date
      | DateObject
      | DateObject[]
      | null,
    variable: string
  ) => {
    const updatedFormParams = { ...formParams };
    if (e && 'target' in e) {
      updatedFormParams[variable] = e.target.value;
    } else if (
      Array.isArray(e) ||
      e instanceof Date ||
      e instanceof DateObject
    ) {
      updatedFormParams[variable] = e;
    }
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
    Field?.isRequired ? requiredFields.push(fieldname) : '';
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
              name={fieldname}
              size="sm"
              rounded="md"
              options={getOptions(Field?.type) ?? [{ value: '', label: '' }]}
              value={formParams[fieldname] as string}
              onChange={(newValue) => handleChangeValue(newValue, fieldname)}
            />
            {fieldname in errors ? (
              <span style={{ color: 'red' }}>{errors[fieldname]}</span>
            ) : (
              ''
            )}
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
              name={fieldname}
              h="50px"
              placeholder={fieldname}
              fontSize="sm"
              onChange={(newValue) => handleChangeValue(newValue, fieldname)}
              value={formParams[fieldname] as string}
            />
            {fieldname in errors ? (
              <span style={{ color: 'red' }}>{errors[fieldname]}</span>
            ) : (
              ''
            )}
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
              name={fieldname}
              onChange={(newValue) => handleChangeValue(newValue, fieldname)}
              value={formParams[fieldname] as string}
            />
            {fieldname in errors ? (
              <span style={{ color: 'red' }}>{errors[fieldname]}</span>
            ) : (
              ''
            )}
          </>
        );
      case 'DateTime':
        formParams[fieldname] = formParams[fieldname] ?? new Date();
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
              <DatePicker
                name={fieldname}
                className="datePicker"
                selected={formParams[fieldname] as Date}
                onChange={(newDate) => handleChangeValue(newDate, fieldname)}
                dateFormat="dd-MM-yyyy"
                value={formParams[fieldname] as string}
              />
              {fieldname in errors ? (
                <span style={{ color: 'red' }}>{errors[fieldname]}</span>
              ) : (
                ''
              )}
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
              <MultiDatePicker
                name={fieldname}
                multiple
                value={formParams[fieldname]}
                onChange={(newDates) => handleChangeValue(newDates, fieldname)}
                plugins={[<Toolbar position="bottom" sort={['close']} />]}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  padding: '3px 10px',
                }}
              />
              {fieldname in errors ? (
                <span style={{ color: 'red' }}>{errors[fieldname]}</span>
              ) : (
                ''
              )}
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
