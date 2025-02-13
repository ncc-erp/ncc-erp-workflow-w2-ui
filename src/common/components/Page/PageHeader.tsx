import { HStack, StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageHeaderProps extends StackProps {
  children: ReactNode;
}

export const PageHeader = ({ children, ...props }: PageHeaderProps) => {
  return (
    <HStack
      px={{ base: '16px', emd: '28px' }}
      py="16px"
      mb="18px"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      {...props}
    >
      {children}
    </HStack>
  );
};
