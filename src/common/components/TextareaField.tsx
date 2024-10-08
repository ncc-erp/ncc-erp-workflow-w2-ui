import { Textarea, TextareaProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type TextareaFieldProps = TextareaProps & Omit<InputWrapperProps, 'children'>;

export const TextareaField = forwardRef(
  ({ error, label, isRequired, ...inputProps }: TextareaFieldProps, ref) => {
    return (
      <InputWrapper
        name={inputProps.name}
        isRequired={isRequired}
        label={label}
        error={error}
      >
        <Textarea ref={ref} placeholder={label} size="sm" {...inputProps} />
      </InputWrapper>
    );
  }
);
