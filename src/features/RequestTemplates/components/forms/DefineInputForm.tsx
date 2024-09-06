import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { SelectField } from 'common/components/SelectField';
import { TextField } from 'common/components/TextField';
import { useFieldArray, useForm } from 'react-hook-form';

import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from '@hookform/error-message';
import {
  useInputDefinition,
  useRequestTemplates,
  useUpdateWorkflowInput,
} from 'api/apiHooks/requestHooks';
import { ErrorDisplay } from 'common/components/ErrorDisplay';
import { toast } from 'common/components/StandaloneToast';
import { GUID_ID_DEFAULT_VALUE } from 'common/constants';
import { option } from 'common/types';
import {
  IUpdateInputFormParams,
  InputDefinition,
  PropertyDefinition,
} from 'models/request';
import { useState } from 'react';

interface DefineInputFormProps {
  inputDefinition?: InputDefinition;
  requestId: string;
  onCloseModal: () => void;
}

interface FormParams {
  items: PropertyDefinition[];
}

const DefineInputForm = ({
  inputDefinition,
  onCloseModal,
  requestId,
}: DefineInputFormProps) => {
  const { data: inputType } = useInputDefinition();
  const { mutateAsync: updateMutate } = useUpdateWorkflowInput();
  const { refetch } = useRequestTemplates();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormParams>({
    criteriaMode: 'all',
    defaultValues: {
      items: inputDefinition?.propertyDefinitions || [
        { name: '', type: 'Text', isRequired: false },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: FormParams) => {
    setIsLoading(true);

    const payload: IUpdateInputFormParams = {
      id: inputDefinition?.id || GUID_ID_DEFAULT_VALUE,
      workflowDefinitionId: requestId,
      propertyDefinitions: data.items,
    };

    await updateMutate(payload);
    refetch();

    setIsLoading(false);
    toast({
      description: 'Create Request Successfully',
      status: 'success',
    });
    onCloseModal();
  };

  const onAddField = () => {
    append({ name: '', isTitle: false, type: 'Text', isRequired: false });
  };

  const items = watch('items');
  const renderFormContent = () => {
    return fields?.map((Field: PropertyDefinition, index: number) => {
      return (
        <>
          <HStack alignItems="flex-end" key={Field?.name + index} mb={1}>
            <FormControl>
              <FormLabel fontSize={16} mb={1} fontWeight="normal">
                Property Name
                <FormHelperText mb={1} as="span">
                  {' '}
                  *
                </FormHelperText>
              </FormLabel>
              <TextField
                h="40px"
                w="210px"
                fontSize="sm"
                {...register(`items.${index}.name`, {
                  required: `Name is Required`,
                })}
              />
              <Box h="20px">
                <ErrorMessage
                  errors={errors}
                  name={`items.${index}.name`}
                  render={({ message }) => <ErrorDisplay message={message} />}
                />
              </Box>
            </FormControl>

            <FormControl mb="20px">
              <FormLabel fontSize={16} mb={1} fontWeight="normal">
                Property Type
              </FormLabel>

              {inputType ? (
                <SelectField
                  h="40px"
                  size="md"
                  rounded="md"
                  options={inputType as option[]}
                  {...register(`items.${index}.type`, {})}
                />
              ) : (
                <Box h="40px">
                  <Spinner />
                </Box>
              )}
            </FormControl>

            <FormControl mb="20px">
              <FormLabel
                textAlign="center"
                fontSize={16}
                mb={1}
                fontWeight="normal"
              >
                Required
              </FormLabel>
              <Center h="40px" mr={3}>
                <Checkbox
                  size="lg"
                  {...register(`items.${index}.isRequired`)}
                />
              </Center>
            </FormControl>

            <FormControl mb="20px">
              <FormLabel
                textAlign="center"
                fontSize={16}
                mb={1}
                fontWeight="normal"
              >
                IsTitle
              </FormLabel>
              <Center h="40px" mr={3}>
                <Checkbox size="lg" {...register(`items.${index}.isTitle`)} />
              </Center>
            </FormControl>
            <Button
              colorScheme="red"
              mb="20px"
              w="250px"
              isDisabled={!(fields.length > 1)}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </HStack>
          {items[index].isTitle && (
            <FormControl
              style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <FormLabel
                textAlign="center"
                fontSize={16}
                mb={1}
                fontWeight="normal"
              >
                Title
              </FormLabel>
              <TextField
                h="40px"
                w="500px"
                fontSize="sm"
                {...register(`items.${index}.titleTemplate`)}
              />
            </FormControl>
          )}
          <Divider my={1} />
        </>
      );
    });
  };

  return (
    <form
      style={{ width: '100%', marginBottom: '20px' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack spacing="14px" alignItems="flex-start">
        {renderFormContent()}

        <Button colorScheme="blue" onClick={onAddField}>
          Add Field
        </Button>
        <Button
          mt="14px"
          h="50px"
          type="submit"
          isLoading={isLoading}
          w="full"
          colorScheme="gray"
        >
          Save
        </Button>
      </VStack>
    </form>
  );
};

export default DefineInputForm;
