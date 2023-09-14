import { Button, Text, VStack } from '@chakra-ui/react';
import { useRequestWorkflow } from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { toast } from 'common/components/StandaloneToast';
import { TextareaField } from 'common/components/TextareaField';
import { LoginStatus } from 'common/enums';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { CustomDatePicker } from 'common/components/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import { office } from 'common/constants';

const initialChangeOfficeRequestFormParams = {
  currentOffice: '',
  destinationOffice: '',
  content: '',
};

const ChangeOfficeRequestForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();
  const { mutateAsync: changeOfficeRequestMutate, isLoading: isLoginLoading } =
    useRequestWorkflow();

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
      ...initialChangeOfficeRequestFormParams,
      currentOffice: defaultOfficeOption?.value,
    },
  });

  const onLogin = async ({
    currentOffice = '',
    destinationOffice = '',
    content = '',
  }) => {
    const { result } = await changeOfficeRequestMutate({
      currentOffice,
      destinationOffice,
      content,
      startDate: startDate,
      endDate: endDate,
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
      onSubmit={handleSubmit(onLogin)}
    >
      <VStack spacing="14px" mt={3} alignItems="flex-start">
        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
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

        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
          Destination Office
        </Text>
        <SelectField
          size="sm"
          rounded="md"
          error={errors.destinationOffice?.message}
          {...register('destinationOffice', {
            required: 'Required destination office!',
          })}
          options={officeOptions}
        />

        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
          Content
        </Text>
        <TextareaField
          error={errors.content?.message}
          {...register('content', {
            required: 'Required content!',
          })}
        />

        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
          Start Date
        </Text>
        <CustomDatePicker inputDate={startDate} onChange={setStartDate} />

        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
          End Date
        </Text>
        <CustomDatePicker inputDate={endDate} onChange={setEndDate} />

        <Button
          mt="14px"
          h="45px"
          w="30%"
          type="submit"
          fontSize="md"
          isLoading={isLoginLoading}
          background="primaryColor"
          colorScheme="primaryColor"
          textColor="white"
          alignSelf="center"
        >
          Save
        </Button>
      </VStack>
    </form>
  );
};

export default ChangeOfficeRequestForm;
