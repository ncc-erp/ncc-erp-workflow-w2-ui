import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideBar';
import { useMediaQuery } from 'hooks/useMediaQuery';
import ScrollTopButton from './ScrollTopButton';
const Layout = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  return (
    <Flex>
      <SideNav isLargeScreen={isLargeScreen} />
      <Box
        style={{
          width: '100% !important',
          overflowX: 'hidden',
        }}
        flex={1}
      >
        <Outlet />
        <ScrollTopButton />
      </Box>
    </Flex>
  );
};

export default Layout;
