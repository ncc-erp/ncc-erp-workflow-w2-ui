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
  IDefineJsonObject,
  IJsonObject,
  InputDefinition,
} from 'models/request';
import { useEffect, useState } from 'react';
import { convertToCase } from 'utils';

interface CreateFormProps {
  inputDefinition?: InputDefinition;
  workflowCreateData?: IJsonObject | null;
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

const CreateForm = ({
  onCloseModal,
  onSuccess,
  workflowCreateData,
}: CreateFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormParams>({
    criteriaMode: 'all',
  });

  useEffect(() => {
    if (
      workflowCreateData &&
      typeof workflowCreateData.defineJson !== 'string'
    ) {
      const formKeys = CreateWorkflowPropertyField.map((field) => field.name);
      Object.entries(workflowCreateData.defineJson as IDefineJsonObject)
        .filter(([key]) => formKeys.includes(key))
        .forEach(([key, value]) => {
          setValue(key, value);
        });
    }
  }, [workflowCreateData, setValue]);
  const { mutateAsync: createMutate } = useCreateWorkflowDefinition();
  const { refetch } = useRequestTemplates();
  const onSubmit = async (data: FormParams) => {
    setIsLoading(true);

    const payload: ICreateFormParams = {
      name: data.name as string,
      displayName: data.displayName as string,
      tag: data.tag as string,
      workflowCreateData: {
        propertyDefinitions: workflowCreateData?.propertyDefinitions ?? [
          { name: '', type: 'Text', isRequired: false },
        ],
        settings: workflowCreateData?.settings ?? {
          color: '#aabbcc',
          titleTemplate: '',
          isSendKomuMessage: false,
        },
        defineJson:
          workflowCreateData?.defineJson &&
          typeof workflowCreateData?.defineJson !== 'string'
            ? JSON.stringify({
                ...workflowCreateData.defineJson,
                name: data.name,
                displayName: data.displayName,
              })
            : workflowCreateData?.defineJson,
      },
    };

    await createMutate(payload).then((definitionId) => {
      refetch();
      setIsLoading(false);
      toast({
        description: 'Create Workflow Successfully',
        status: 'success',
      });
      onCloseModal();
      onSuccess(definitionId);
    });
  };

  const getField = (Field: CreateWorkflowPropertyDefinition) => {
    const fieldName = Field?.name ? Field.name : '';
    return (
      <FormControl key={Field?.name}>
        <FormLabel fontSize={16} my={1} fontWeight="normal">
          {convertToCase(fieldName)}
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
          placeholder={convertToCase(fieldName)}
          fontSize="sm"
          {...register(fieldName, {
            required: Field?.isRequired
              ? `${convertToCase(fieldName)} is Required!`
              : false,
          })}
        />
        <ErrorMessage
          errors={errors}
          name={fieldName}
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
