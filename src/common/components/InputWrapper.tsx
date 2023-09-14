import { ReactNode } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';

export interface InputWrapperProps {
  children: ReactNode;
  label?: string;
  error?: string;
  isRequired?: boolean;
}

export const InputWrapper = ({ children, label, error, isRequired }: InputWrapperProps) => {
  const isInvalid = !!error;

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && (
        <FormLabel fontSize={15} my={3} fontWeight="medium">
          {label}
        </FormLabel>
      )}
      {children}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
