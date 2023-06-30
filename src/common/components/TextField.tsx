import { Input, InputProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type TextFieldFieldProps = InputProps & Omit<InputWrapperProps, 'children'>;

export const TextField = forwardRef(
  ({ error, label, ...inputProps }: TextFieldFieldProps, ref) => {
    return (
      <InputWrapper
        label={label}
        error={error}
      >
        <Input
          {...inputProps}
          type='text'
          ref={ref}
        />
      </InputWrapper>
    );
  }
);
