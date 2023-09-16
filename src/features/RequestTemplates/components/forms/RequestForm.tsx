import { Button, Text, VStack } from '@chakra-ui/react';
import {
  useOfficeEquipmentRequestWorkflow,
  useOffices,
  useUserProjects,
  useUserInfoWithBranch,
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

import { InputDefinition, PropertyDefinition } from 'models/request';
import { IOffices } from 'models/office';
import { IProjects } from 'models/project';
import { parseJwt } from 'utils/parseJwt';
import { ChangeEvent, useState } from 'react';

interface RequestFormProps {
  inputDefinition?: InputDefinition;
}
type FormParams = Record<
  string,
  string | DateObject | DateObject[] | null | Date | undefined
>;

const RequestForm = ({ inputDefinition }: RequestFormProps) => {
  const { data: offices } = useOffices();
  const { data: projects } = useUserProjects();
  const userInfo = parseJwt(localStorage.getItem('accessToken'));
  const { data: user } = useUserInfoWithBranch(userInfo.email);

  const { isLoading: isLoginLoading } = useOfficeEquipmentRequestWorkflow();

  const [formParams, setFormParams] = useState<FormParams>({});

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

  const { handleSubmit } = useForm({});

  const onSubmit = async () => {
    console.log(11111, formParams);
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
  const getField = (Field: PropertyDefinition) => {
    const fieldname = Field?.name ? Field.name : '';
    switch (Field?.type) {
      case 'OfficeList':
      case 'MyProject':
        formParams[fieldname] = formParams[fieldname] ?? user?.branch;
        return (
          <>
            <Text whiteSpace="nowrap" fontSize="md">
              {fieldname}
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
          </>
        );
      case 'Text':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <>
            <Text whiteSpace="nowrap" fontSize="md">
              {fieldname}
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
          </>
        );
      case 'RichText':
        formParams[fieldname] = formParams[fieldname] ?? '';
        return (
          <>
            <Text whiteSpace="nowrap" fontSize="md">
              {fieldname}
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
          </>
        );
      case 'DateTime':
        formParams[fieldname] = formParams[fieldname] ?? new Date();
        if (fieldname != 'Dates')
          return (
            <>
              <Text whiteSpace="nowrap" fontSize="md">
                {Field?.name}
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
            </>
          );
        else
          return (
            <>
              <Text whiteSpace="nowrap" fontSize="md">
                {Field?.name}
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
                  height: '32px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  padding: '3px 10px',
                }}
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
          isLoading={isLoginLoading}
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
