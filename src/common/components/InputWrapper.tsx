import { ReactNode } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormLabelProps,
} from '@chakra-ui/react';

export interface InputWrapperProps {
  children: ReactNode;
  label?: string;
  labelProps?: FormLabelProps;
  error?: string;
  isRequired?: boolean;
  name?: string;
}

export const InputWrapper = ({
  children,
  label,
  labelProps,
  error,
  name,
  isRequired,
}: InputWrapperProps) => {
  const isInvalid = !!error;

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && (
        <FormLabel fontSize={15} my={3} fontWeight="medium" {...labelProps}>
          {label}
        </FormLabel>
      )}
      <div data-testid={name}>{children}</div>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
