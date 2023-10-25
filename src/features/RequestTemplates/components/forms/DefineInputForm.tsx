import {
  Box,
  Button,
  Checkbox,
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
import { useQueryClient } from '@tanstack/react-query';
import { ErrorDisplay } from 'common/components/ErrorDisplay';
import { toast } from 'common/components/StandaloneToast';
import { InputDefinition, PropertyDefinition } from 'models/request';
import { useState } from 'react';
import { useInputDefinition } from 'api/apiHooks/requestHooks';
import { option } from 'common/types';

interface DefineInputFormProps {
  inputDefinition?: InputDefinition;
  onCloseModal: () => void;
}

interface FormParams {
  items: PropertyDefinition[];
}

const DefineInputForm = ({
  inputDefinition,
  onCloseModal,
}: DefineInputFormProps) => {
  const queryClient = useQueryClient();
  const { data: inputType } = useInputDefinition();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormParams>({
    criteriaMode: 'all',
    defaultValues: {
      items: inputDefinition?.propertyDefinitions || [
        { name: '', type: '', isRequired: false },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async () => {
    setIsLoading(true);
    // TO DO SUBMIT

    queryClient.clear();
    setIsLoading(false);
    toast({
      description: 'Create Request Successfully',
      status: 'success',
    });
    onCloseModal();
  };

  const onAddField = () => {
    append({ name: '', type: '', isRequired: false });
  };

  const renderFormContent = () => {
    return fields?.map((Field: PropertyDefinition, index: number) => {
      return (
        <HStack alignItems="flex-end" key={Field?.name + index}>
          <FormControl>
            <FormLabel fontSize={16} my={1} fontWeight="normal">
              Property Name
              <FormHelperText my={1} style={{ color: 'red' }} as="span">
                {' '}
                *
              </FormHelperText>
            </FormLabel>
            <TextField
              h="50px"
              w="250px"
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
            <FormLabel fontSize={16} my={1} fontWeight="normal">
              Property Type
            </FormLabel>

            {inputType ? (
              <SelectField
                h="50px"
                size="md"
                rounded="md"
                options={inputType as option[]}
                {...register(`items.${index}.type`, {})}
              />
            ) : (
              <Box h="50px">
                <Spinner />
              </Box>
            )}
          </FormControl>

          <FormControl textAlign="center" mb="20px">
            <Checkbox {...register(`items.${index}.isRequired`)}>
              Required
            </Checkbox>
          </FormControl>

          <Button
            colorScheme="red"
            mb="20px"
            w="200px"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </HStack>
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
