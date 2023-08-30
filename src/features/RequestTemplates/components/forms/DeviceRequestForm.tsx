import { Button, Text, VStack } from '@chakra-ui/react';
import { useDeviceRequestWorkflow } from 'api/apiHooks/requestHooks';
import { SelectField } from 'common/components/SelectField';
import { toast } from 'common/components/StandaloneToast';
import { TextareaField } from 'common/components/TextareaField';
import { LoginStatus } from 'common/enums';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TextField } from 'common/components/TextField';
import { office, project } from 'common/constants';
import 'react-datepicker/dist/react-datepicker.css';

const initialDeviceRequestFormParams = {
  currentOffice: '',
  currentProject: '',
  device: '',
  reason: '',
};

const DeviceRequestForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: changeOfficeRequestMutate, isLoading: isLoginLoading } =
    useDeviceRequestWorkflow();

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
      ...initialDeviceRequestFormParams,
      currentOffice: defaultOfficeOption?.value,
      currentProject: defaultProjectOption?.value,
    },
  });

  const onLogin = async ({
    currentOffice = '',
    currentProject = '',
    device = '',
    reason = '',
  }) => {
    const { result } = await changeOfficeRequestMutate({
      currentOffice,
      currentProject,
      device,
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
      onSubmit={handleSubmit(onLogin)}
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

        <Text whiteSpace="nowrap" fontSize="md">
          Device
        </Text>
        <TextField
          h="50px"
          placeholder="Device request name"
          fontSize="sm"
          error={errors.device?.message}
          {...register('device', {
            required: 'Required request device!',
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

export default DeviceRequestForm;
