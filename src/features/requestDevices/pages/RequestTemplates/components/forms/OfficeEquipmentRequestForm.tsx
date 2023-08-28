import { Button, Text, VStack } from '@chakra-ui/react';
import { useOfficeEquipmentRequestWorkflow } from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { toast } from 'common/components/StandaloneToast';
import { TextareaField } from 'common/components/TextareaField';
import { LoginStatus } from 'common/enums';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { office } from 'common/constants';
import 'react-datepicker/dist/react-datepicker.css';

const initialOfficeEquipmentRequestFormParams = {
  currentOffice: '',
  reason: '',
};

const OfficeEquipmentRequestForm = () => {
  const navigate = useNavigate();
  const {
    mutateAsync: officeEquipmentRequestMutate,
    isLoading: isLoginLoading,
  } = useOfficeEquipmentRequestWorkflow();

  const officeOptions = useMemo(() => {
    const options = Object.values(office).map((x) => ({
      value: x.value,
      label: x.label,
    }));

    return options;
  }, []);

  const defaultOfficeOption = useMemo(() => {
    const result = Object.values(office).find((value) => {
      return value.isCurrent === true;
    });

    return result;
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialOfficeEquipmentRequestFormParams,
      currentOffice: defaultOfficeOption?.value,
    },
  });

  const onSubmit = async ({ currentOffice = '', reason = '' }) => {
    const { result } = await officeEquipmentRequestMutate({
      currentOffice,
      reason,
    });

    if (result === LoginStatus.success) {
      navigate('/');
      return;
    }

    toast({
      title: 'Request Failed!',
      description: 'Invalid username or password!',
      status: 'error',
    });
  };

  return (
    <form
      style={{ width: '100%', marginBottom: '20px' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack spacing="14px" alignItems="flex-start">
        <Text whiteSpace="nowrap" fontSize="md">
          Current Office
        </Text>
        <SelectField
          size="sm"
          rounded="md"
          options={officeOptions}
          error={errors.currentOffice?.message}
          {...register('currentOffice', {
            required: 'Required current office!',
          })}
        />

        <Text whiteSpace="nowrap" fontSize="md">
          Reason
        </Text>
        <TextareaField
          error={errors.reason?.message}
          {...register('reason', {
            required: 'Required reason!',
          })}
        />

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

export default OfficeEquipmentRequestForm;
