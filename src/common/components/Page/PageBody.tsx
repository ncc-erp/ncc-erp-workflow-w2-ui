import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageProps extends BoxProps {
  children: ReactNode;
}

export const PageBody = ({ children, ...props }: PageProps) => {
  return <Box {...props}>{children}</Box>;
};
