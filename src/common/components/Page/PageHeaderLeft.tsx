import { StackItem } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageHeaderLeftProps {
  children: ReactNode;
}

export const PageHeaderLeft = ({ children }: PageHeaderLeftProps) => {
  return <StackItem justifySelf="flex-start">{children}</StackItem>;
};
