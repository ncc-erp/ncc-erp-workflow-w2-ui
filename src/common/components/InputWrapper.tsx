import { ReactNode } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';

export interface InputWrapperProps {
  children: ReactNode;
  label?: string;
  error?: string;
}

export const InputWrapper = ({ children, label, error }: InputWrapperProps) => {
  const isInvalid = !!error;

  return (
    <FormControl isInvalid={isInvalid}>
      {label && <FormLabel fontSize={14} my={3}>{label}</FormLabel>}
      {children}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
