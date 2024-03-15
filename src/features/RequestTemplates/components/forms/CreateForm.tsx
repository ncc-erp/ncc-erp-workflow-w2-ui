import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import {
  useCreateWorkflowDefinition,
  useRequestTemplates,
} from 'api/apiHooks/requestHooks';
import { TextField } from 'common/components/TextField';
import { useForm } from 'react-hook-form';

import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from '@hookform/error-message';
import { ErrorDisplay } from 'common/components/ErrorDisplay';
import { toast } from 'common/components/StandaloneToast';
import {
  CreateWorkflowPropertyDefinition,
  ICreateFormParams,
  InputDefinition,
} from 'models/request';
import { useState } from 'react';
import { convertToCase } from 'utils';

interface CreateFormProps {
  inputDefinition?: InputDefinition;
  onCloseModal: () => void;
  onSuccess: (workflowId: string) => void;
}
export type FormParams = Record<string, string | null | undefined>;

const CreateWorkflowPropertyField: CreateWorkflowPropertyDefinition[] = [
  {
    name: 'name',
    isRequired: true,
  },
  {
    name: 'displayName',
    isRequired: true,
  },
  {
    name: 'tag',
    isRequired: false,
  },
];

const CreateForm = ({ onCloseModal, onSuccess }: CreateFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormParams>({
    criteriaMode: 'all',
  });
  const { mutateAsync: createMutate } = useCreateWorkflowDefinition();
  const { refetch } = useRequestTemplates();
  const onSubmit = async (data: FormParams) => {
    setIsLoading(true);

    const payload: ICreateFormParams = {
      name: data.name as string,
      displayName: data.displayName as string,
      tag: data.tag as string,
    };

    await createMutate(payload).then(() => {
      refetch();
      setIsLoading(false);
      toast({
        description: 'Create Workflow Successfully',
        status: 'success',
      });
      onCloseModal();
      onSuccess('3a115306-3d91-4b5c-e346-4e6dcbde5ac2');
    });
  };

  const getField = (Field: CreateWorkflowPropertyDefinition) => {
    const fieldname = Field?.name ? Field.name : '';
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
          placeholder={convertToCase(fieldname)}
          fontSize="sm"
          {...register(fieldname, {
            required: Field?.isRequired
              ? `${convertToCase(fieldname)} is Required!`
              : false,
          })}
        />
        <ErrorMessage
          errors={errors}
          name={fieldname}
          render={({ message }) => <ErrorDisplay message={message} />}
        />
      </FormControl>
    );
  };

  const renderFormContent = (
    Fields: CreateWorkflowPropertyDefinition[] | undefined
  ) => {
    return Fields?.map(function (Field: CreateWorkflowPropertyDefinition) {
      return getField(Field);
    });
  };

  return (
    <form
      style={{ width: '100%', marginBottom: '20px' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack spacing="14px" alignItems="flex-start">
        {renderFormContent(CreateWorkflowPropertyField)}
        <Button
          mt="14px"
          h="50px"
          type="submit"
          isLoading={isLoading}
          w="full"
          colorScheme="gray"
        >
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default CreateForm;
