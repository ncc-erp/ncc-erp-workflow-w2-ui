import { Input, InputProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type NumericFieldProps = InputProps & Omit<InputWrapperProps, 'children'>;

export const NumericField = forwardRef(
  ({ error, label, isRequired, ...inputProps }: NumericFieldProps, ref) => {
    return (
      <InputWrapper label={label} error={error} isRequired={isRequired}>
        <Input {...inputProps} type="number" ref={ref} />
      </InputWrapper>
    );
  }
);
