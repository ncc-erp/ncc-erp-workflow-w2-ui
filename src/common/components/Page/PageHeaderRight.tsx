import { StackItem } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageHeaderRightProps {
	children: ReactNode;
}

export const PageHeaderRight = ({ children }: PageHeaderRightProps) => {
	return <StackItem justifySelf="flex-end">{children}</StackItem>;
};
