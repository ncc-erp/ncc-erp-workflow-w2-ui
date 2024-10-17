import { ReactNode } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';

export interface InputWrapperProps {
  children: ReactNode;
  label?: string;
  error?: string;
  isRequired?: boolean;
  name?: string;
}

export const InputWrapper = ({ children, label, error, name, isRequired }: InputWrapperProps) => {
  const isInvalid = !!error;

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && (
        <FormLabel fontSize={15} my={3} fontWeight="medium">
          {label}
        </FormLabel>
      )}
      <div data-testid={name}>{children}</div>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
