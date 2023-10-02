import { useEffect, useMemo, useRef } from 'react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { TextareaField } from '../TextareaField';
import { ErrorMessage } from '@hookform/error-message';
import { ErrorDisplay } from '../ErrorDisplay';

interface ModalBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: string) => void;
  showReason: boolean;
  showDynamicForm?: boolean;
  dynamicForm?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  setReason: (data: string) => void;
}

interface IDynamicFormProps {
  [key: string]: string;
}

const ModalBoard = (props: ModalBoardProps): JSX.Element => {
  const cancelRef = useRef(null);
  const {
    isDisabled = false,
    isLoading = false,
    isOpen,
    onClose,
    onConfirm,
    showReason = false,
    showDynamicForm = false,
    dynamicForm = '',
    setReason,
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
  });

  useEffect(() => {
    reset();
  }, [reset, showDynamicForm]);

  const dynamicFormParse = useMemo(() => {
    if (showDynamicForm) {
      return JSON.parse(dynamicForm);
    }
    return {};
  }, [dynamicForm, showDynamicForm]);

  const toDisplayName = (inputName: string) => {
    return inputName.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const renderFormContent = (data: IDynamicFormProps[] | undefined) => {
    return data?.map(function (element, ind) {
      return (
        <FormControl key={ind}>
          <FormLabel fontSize={16} my={1} fontWeight="normal">
            {toDisplayName(element.name)}
            {element.isRequired ? (
              <FormHelperText my={1} style={{ color: 'red' }} as="span">
                {' '}
                *
              </FormHelperText>
            ) : (
              ''
            )}
          </FormLabel>
          <TextareaField
            {...register(element.name, {
              required: element.isRequired
                ? `${toDisplayName(element.name)} is Required`
                : false,
            })}
          />
          <ErrorMessage
            errors={errors}
            name={element.name}
            render={({ message }) => <ErrorDisplay message={message} />}
          />
        </FormControl>
      );
    });
  };

  const onSubmit = async (data: IDynamicFormProps) => {
    if (showDynamicForm) {
      for (const item of dynamicFormParse) {
        if (Object.prototype.hasOwnProperty.call(data, item.name)) {
          item.data = data[item.name];
        }
      }
      onConfirm(JSON.stringify(dynamicFormParse));
      return;
    }

    onConfirm();
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" pb={1}>
              Update status
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text
                whiteSpace="nowrap"
                fontSize="md"
                fontWeight="medium"
                pb={0}
              >
                Do you want to update status ?
              </Text>
              {showDynamicForm && (
                <form
                  style={{ width: '100%', margin: '10px 0' }}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <VStack spacing="14px" alignItems="flex-start">
                    {renderFormContent(dynamicFormParse)}
                  </VStack>
                </form>
              )}
              {showReason && (
                <Box mt={5}>
                  <Text
                    whiteSpace="nowrap"
                    fontSize="md"
                    fontWeight="medium"
                    pb={2}
                    pt={0}
                  >
                    Reason *
                  </Text>
                  <Input
                    type="text"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Box>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleSubmit(onSubmit)}
                ml={3}
                isDisabled={isDisabled || isLoading}
              >
                {isLoading ? <Spinner /> : 'Confirm'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ModalBoard;
