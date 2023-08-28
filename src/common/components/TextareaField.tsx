import { Textarea, TextareaProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type TextareaFieldProps = TextareaProps & Omit<InputWrapperProps, 'children'>;

export const TextareaField = forwardRef(
  ({ error, label, ...inputProps }: TextareaFieldProps, ref) => {
    return (
      <InputWrapper label={label} error={error}>
        <Textarea ref={ref} placeholder="Content" size="sm" {...inputProps} />
      </InputWrapper>
    );
  }
);
