import { Center, CenterProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface EmptyWrapperProps extends CenterProps {
  children: ReactNode;
  isEmpty: boolean;
  message: ReactNode;
}

export const EmptyWrapper = ({
  children,
  isEmpty,
  message = 'empty',
  ...props
}: EmptyWrapperProps) => {
  return isEmpty ? <Center {...props}>{message}</Center> : <>{children}</>;
};
