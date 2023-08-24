import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideBar';
const Layout = () => {
  return (
    <Flex>
      <SideNav />
      <Box flex={1}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;
