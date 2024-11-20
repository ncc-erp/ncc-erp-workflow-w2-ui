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
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { ErrorDisplay } from '../ErrorDisplay';
import { renderColor } from 'utils/getColorTypeRequest';
import styles from './style.module.scss';
import { CustomDatePicker } from '../DatePicker';
import { DateObject } from 'react-multi-date-picker';
import { formatDateForm } from 'utils/dateUtils';
import { convertToCase, toDisplayName } from 'utils/convertToCase';
import { parse } from 'date-fns';
import MarkdownEditor from '../MarkdownEditor';

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
  reason?: string;
  shortTitle?: string;
  id?: string;
  name?: string;
  requestUser?: string;
}

interface IDynamicFormProps {
  [key: string]:
    | string
    | DateObject
    | DateObject[]
    | null
    | Date
    | undefined
    | number;
}

const ModalBoard = ({
  isDisabled = false,
  isLoading = false,
  isOpen,
  onClose,
  onConfirm,
  showReason = false,
  showDynamicForm = false,
  dynamicForm = '',
  setReason,
  shortTitle,
  name,
  requestUser,
  reason,
}: ModalBoardProps): JSX.Element => {
  const cancelRef = useRef(null);
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    criteriaMode: 'all',
  });

  useEffect(() => {
    reset();
  }, [reset, showDynamicForm]);

  const dynamicFormParse = useMemo(() => {
    try {
      if (showDynamicForm && dynamicForm.length > 0) {
        return JSON.parse(dynamicForm);
      }
    } catch (error) {
      console.error('Invalid JSON format:', error);
      return [];
    }
  }, [dynamicForm, showDynamicForm]);

  useEffect(() => {
    if (showDynamicForm) {
      dynamicFormParse.forEach((element: IDynamicFormProps) => {
        if (element.type === 'dateTime' && element.defaultValue) {
          const defaultDate = parse(
            element.defaultValue as string,
            'dd/MM/yyyy',
            new Date()
          );
          setValue(element.name as string, defaultDate);
        }
      });
    }
  }, [dynamicFormParse, setValue, showDynamicForm]);

  const renderFormContent = (data: IDynamicFormProps[] | undefined) => {
    return data?.map(function (element, ind) {
      return (
        <FormControl key={ind}>
          <FormLabel fontSize={16} my={1} fontWeight="normal">
            {toDisplayName(element.name as string)}
            {element.isRequired ? (
              <FormHelperText my={1} style={{ color: 'red' }} as="span">
                &nbsp;*
              </FormHelperText>
            ) : (
              ''
            )}
          </FormLabel>
          {element.type === 'dateTime' ? (
            <Controller
              control={control}
              name={element.name as string}
              rules={{
                required: element.isRequired
                  ? `${convertToCase(element.name as string)} is Required!`
                  : false,
              }}
              render={({ field }) => (
                <CustomDatePicker
                  inputDate={field.value as Date}
                  onChange={(date: Date) => field.onChange(date)}
                />
              )}
            />
          ) : (
            <Controller
              defaultValue={element.defaultValue as string}
              name={element.name as string}
              control={control}
              rules={{
                required: element?.isRequired
                  ? `${convertToCase(element.name as string)} is Required`
                  : false,
              }}
              render={({ field }) => (
                <MarkdownEditor {...field} value={field.value?.toString()} />
              )}
            />
          )}
          <ErrorMessage
            errors={errors}
            name={element.name as string}
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
          const value = data[item.name];
          if (
            value instanceof Date ||
            value instanceof DateObject ||
            Array.isArray(value)
          ) {
            item.data = formatDateForm(value);
          } else {
            item.data = value;
          }
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
        autoFocus={false}
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
              <Box style={{ padding: '4px 0' }}>
                {shortTitle && (
                  <Text
                    whiteSpace="nowrap"
                    fontSize="xs"
                    fontWeight="medium"
                    pb={0}
                  >
                    Title: {shortTitle}
                  </Text>
                )}
                {requestUser && (
                  <Text
                    whiteSpace="nowrap"
                    fontSize="xs"
                    fontWeight="medium"
                    pb={0}
                  >
                    Request User: {requestUser}
                  </Text>
                )}
                {name && (
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: renderColor(name),
                    }}
                  >
                    {name}
                  </span>
                )}
              </Box>

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
                    Reason
                    <span style={{ color: 'red' }}> *</span>
                  </Text>
                  <MarkdownEditor
                    onChange={(value) => setReason(value || '')}
                    value={reason}
                    type="editor"
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
                isDisabled={
                  isDisabled || isLoading || (showDynamicForm && !isValid)
                }
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
