import { FormHelperText } from '@chakra-ui/react';

interface ErrorDisplayProps {
  message: string;
}
export const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  return (
    <FormHelperText fontSize={15} my={1} style={{ color: 'red' }} as="span">
      {message}
    </FormHelperText>
  );
};
