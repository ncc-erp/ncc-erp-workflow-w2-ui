import { Heading, HeadingProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageHeadingProps extends HeadingProps {
  children: ReactNode;
}

export const PageHeading = ({ children, ...props }: PageHeadingProps) => {
  return (
    <Heading as="h1" fontSize="lg" fontWeight={600} {...props}>
      {children}
    </Heading>
  );
};
