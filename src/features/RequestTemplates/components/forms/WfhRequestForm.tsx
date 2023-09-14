import { Button, Text, VStack } from '@chakra-ui/react';
import { useWfhRequestWorkflow } from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { toast } from 'common/components/StandaloneToast';
import { TextareaField } from 'common/components/TextareaField';
import { LoginStatus } from 'common/enums';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { CustomDatePicker } from 'common/components/DatePicker';
import { office, project } from 'common/constants';
import 'react-datepicker/dist/react-datepicker.css';

const initialWfhRequestFormParams = {
  currentOffice: '',
  currentProject: '',
  reason: '',
};

const WfhRequestForm = () => {
  const [startDate, setStartDate] = useState(new Date());

  const navigate = useNavigate();
  const { mutateAsync: changeOfficeRequestMutate, isLoading: isLoginLoading } =
    useWfhRequestWorkflow();

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

  const projectOptions = useMemo(() => {
    const options = Object.values(project).map((x) => ({
      value: x.value,
      label: x.label,
    }));

    return options;
  }, []);

  const defaultProjectOption = useMemo(() => {
    const result = Object.values(project).find((value) => {
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
      ...initialWfhRequestFormParams,
      currentOffice: defaultOfficeOption?.value,
      currentProject: defaultProjectOption?.value,
    },
  });

  const onLogin = async ({
    currentOffice = '',
    currentProject = '',
    reason = '',
  }) => {
    const { result } = await changeOfficeRequestMutate({
      currentOffice,
      currentProject,
      reason,
      date: startDate,
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
      <VStack spacing="14px" alignItems="flex-start">
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
          Project
        </Text>
        <SelectField
          size="sm"
          rounded="md"
          error={errors.currentProject?.message}
          {...register('currentProject', {
            required: 'Required current project!',
          })}
          options={projectOptions}
        />

        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
          Reason
        </Text>
        <TextareaField
          error={errors.reason?.message}
          {...register('reason', {
            required: 'Required reason!',
          })}
        />

        <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium">
          Date
        </Text>
        <CustomDatePicker inputDate={startDate} onChange={setStartDate} />

        <Button
          mt="14px"
          h="45px"
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

export default WfhRequestForm;
