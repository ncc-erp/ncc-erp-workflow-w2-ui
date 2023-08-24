import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { PageHeader } from 'common/components/Page/PageHeader';
import { PageHeading } from 'common/components/Page/PageHeading';
import { PageHeaderLeft } from 'common/components/Page/PageHeaderLeft';
import { PageHeaderRight } from 'common/components/Page/PageHeaderRight';
import { PageBody } from 'common/components/Page/PageBody';

interface PageProps extends BoxProps {
  children: ReactNode;
}

const Page = ({ children, ...props }: PageProps) => {
  return <Box {...props}>{children}</Box>;
};

Page.Header = PageHeader;
Page.Heading = PageHeading;
Page.HeaderLeft = PageHeaderLeft;
Page.HeaderRight = PageHeaderRight;
Page.Body = PageBody;

export default Page;
