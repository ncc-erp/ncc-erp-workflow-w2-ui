import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { SelectField } from 'common/components/SelectField';
import { TextField } from 'common/components/TextField';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from '@hookform/error-message';
import {
  useInputDefinition,
  useUpdateWorkflowInput,
} from 'api/apiHooks/requestHooks';
import { ErrorDisplay } from 'common/components/ErrorDisplay';
import { toast } from 'common/components/StandaloneToast';
import { GUID_ID_DEFAULT_VALUE, QueryKeys } from 'common/constants';
import { option } from 'common/types';
import {
  IUpdateInputFormParams,
  InputDefinition,
  PropertyDefinition,
  Settings,
} from 'models/request';
import { Fragment, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
interface DefineInputFormProps {
  inputDefinition?: InputDefinition;
  requestId: string;
  onCloseModal: () => void;
  settingsToSet: Settings;
  isChangedBySubmitSettings: boolean;
}

interface FormParams {
  items: PropertyDefinition[];
}

const DefineInputForm = ({
  inputDefinition,
  onCloseModal,
  requestId,
  settingsToSet,
  isChangedBySubmitSettings,
}: DefineInputFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: inputType } = useInputDefinition();
  const { mutateAsync: updateMutate } = useUpdateWorkflowInput();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
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

  useEffect(() => {
    if (inputDefinition) {
      reset({
        items: inputDefinition?.propertyDefinitions || [
          { name: '', type: 'Text', isRequired: false },
        ],
      });
    }
  }, [inputDefinition, reset]);

  const onSubmit = async (data: FormParams) => {
    setIsLoading(true);

    const payload: IUpdateInputFormParams = {
      id: inputDefinition?.id || GUID_ID_DEFAULT_VALUE,
      workflowDefinitionId: requestId,
      propertyDefinitions: data.items,
      defineJson:
        inputDefinition?.defineJson &&
        typeof inputDefinition?.defineJson !== 'string'
          ? JSON.stringify({
              ...inputDefinition.defineJson,
              displayName: inputDefinition.requestDisplayName,
              name: inputDefinition.nameRequest,
            })
          : inputDefinition?.defineJson,
      settings: isChangedBySubmitSettings
        ? settingsToSet
        : inputDefinition?.settings,
    };

    await updateMutate(payload);
    queryClient.invalidateQueries({ queryKey: [QueryKeys.REQUEST_TEMPLATES] });

    setIsLoading(false);
    toast({
      description: t('REQUEST_TEMPLATES_PAGE.MESSAGES.CREATE_REQUEST_SUCCESS'),
      status: 'success',
    });
    onCloseModal();
  };

  const onAddField = () => {
    append({ name: '', type: 'Text', isRequired: false });
  };

  const renderFormContent = () => {
    return fields?.map((Field: PropertyDefinition, index: number) => {
      return (
        <Fragment key={Field?.name + index}>
          <Flex
            gap={[0, '8px']}
            flexDirection={['column', 'row']}
            mb={1}
            w="full"
            alignItems={['unset', 'flex-end']}
          >
            <FormControl>
              <FormLabel fontSize={['sm', 'md']} mb={1} fontWeight="normal">
                {t('REQUEST_TEMPLATES_PAGE.FORMS.DEFINE_INPUT.PROPERTY_NAME')}
                <FormHelperText mb={1} as="span">
                  {' '}
                  *
                </FormHelperText>
              </FormLabel>
              <TextField
                h="40px"
                w={['full', '210px']}
                fontSize="sm"
                {...register(`items.${index}.name`, {
                  required: t(
                    'REQUEST_TEMPLATES_PAGE.FORMS.DEFINE_INPUT.NAME_REQUIRED'
                  ),
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
              <FormLabel fontSize={['sm', 'md']} mb={1} fontWeight="normal">
                {t('REQUEST_TEMPLATES_PAGE.FORMS.DEFINE_INPUT.PROPERTY_TYPE')}
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

            <FormControl
              mb="20px"
              display={['flex', 'block']}
              alignItems="center"
              gap="8px"
              justifyContent="space-between"
            >
              <FormLabel
                textAlign={['left', 'center']}
                fontSize={['sm', 'md']}
                mb={1}
                fontWeight="normal"
                mr={0}
              >
                {t('REQUEST_TEMPLATES_PAGE.FORMS.DEFINE_INPUT.REQUIRED')}
              </FormLabel>
              <Center h="40px">
                <Controller
                  name={`items.${index}.isRequired`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      size="lg"
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </Center>
            </FormControl>
            <Button
              variant="primary"
              mb={[0, '20px']}
              w={['full', '250px']}
              isDisabled={!(fields.length > 1)}
              onClick={() => remove(index)}
            >
              {t('REQUEST_TEMPLATES_PAGE.REMOVE_BUTTON')}
            </Button>
          </Flex>
          <Divider my={1} />
        </Fragment>
      );
    });
  };

  return (
    <form
      style={{ width: '100%', marginBottom: '20px' }}
      onSubmit={handleSubmit(onSubmit)}
      data-testid="define-input-form"
    >
      <VStack spacing="14px" alignItems="flex-start">
        {renderFormContent()}

        <Button
          colorScheme="blue"
          onClick={onAddField}
          data-testid="button-add-field"
          w={['full', 'auto']}
        >
          {t('REQUEST_TEMPLATES_PAGE.ADD_FIELD_BUTTON')}
        </Button>
      </VStack>
      <Button
        mt="14px"
        h="50px"
        type="submit"
        isLoading={isLoading}
        w="full"
        colorScheme="gray"
        fontSize={['sm', 'md']}
      >
        {t('REQUEST_TEMPLATES_PAGE.SAVE_BUTTON')}
      </Button>
    </form>
  );
};

export default DefineInputForm;
