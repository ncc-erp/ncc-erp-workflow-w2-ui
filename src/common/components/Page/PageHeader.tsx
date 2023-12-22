import { HStack, StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageHeaderProps extends StackProps {
  children: ReactNode;
}

export const PageHeader = ({ children, ...props }: PageHeaderProps) => {
  return (
    <HStack
      px="24px"
      py="20px"
      h="78px"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      {...props}
    >
      {children}
    </HStack>
  );
};
