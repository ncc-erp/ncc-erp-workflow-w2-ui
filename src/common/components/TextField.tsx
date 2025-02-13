import { Input, InputProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type TextFieldFieldProps = InputProps & Omit<InputWrapperProps, 'children'>;

export const TextField = forwardRef(
  (
    {
      error,
      label,
      isRequired,
      labelProps,
      ...inputProps
    }: TextFieldFieldProps,
    ref
  ) => {
    return (
      <InputWrapper
        name={inputProps.name}
        label={label}
        error={error}
        isRequired={isRequired}
        labelProps={labelProps}
      >
        <Input {...inputProps} type="text" ref={ref} />
      </InputWrapper>
    );
  }
);
