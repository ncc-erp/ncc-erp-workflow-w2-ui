import { Input, InputProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type TextFieldFieldProps = InputProps & Omit<InputWrapperProps, 'children'>;

export const TextField = forwardRef(
  ({ error, label, isRequired, ...inputProps }: TextFieldFieldProps, ref) => {
    return (
      <InputWrapper label={label} error={error} isRequired={isRequired}>
        <Input {...inputProps} type="text" ref={ref} />
      </InputWrapper>
    );
  }
);
