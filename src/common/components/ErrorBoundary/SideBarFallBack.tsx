import {
  VStack,
  Button,
  Text,
  Box,
  HStack,
  Image,
  Heading,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LocalStorageKeys } from 'common/enums';
import { removeItem } from 'utils';
import Logo from 'assets/images/ncc_logo.png';
import { useRecoilValue } from 'recoil';
import { appConfigState, useSetAppConfig } from 'stores/appConfig';

interface SideBarErrorFallbackProps {
  onRetry: () => void;
  isLargeScreen: boolean;
}

const SideBarErrorFallback = ({
  onRetry,
  isLargeScreen,
}: SideBarErrorFallbackProps) => {
  const navigate = useNavigate();
  const { openSideBar } = useRecoilValue(appConfigState);
  const { onCloseSideBar } = useSetAppConfig();

  const handleLogout = () => {
    removeItem(LocalStorageKeys.accessToken);
    navigate('/login');
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const SideBarErrorContent = () => (
    <VStack
      bg="sidebarBg"
      h="100vh"
      alignItems="stretch"
      display="flex"
      flexDirection="column"
      spacing={0}
      minW={isLargeScreen ? '280px' : 'auto'}
    >
      <Box
        width="100%"
        padding={isLargeScreen ? '0px 16px' : '8px 16px 0px 16px'}
      >
        <HStack
          cursor="pointer"
          alignItems="center"
          height="80px"
          spacing="12px"
          onClick={() => navigate('/')}
        >
          <Image h="40px" src={Logo} />
          {isLargeScreen && (
            <Heading color="#ffffff" fontWeight="500px" fontSize="18px">
              NCC Workflow
            </Heading>
          )}
        </HStack>
      </Box>

      <VStack
        flex={1}
        p="12px"
        mt="12px"
        align="center"
        justify="center"
        spacing="16px"
      >
        <Text fontSize="4xl">⚠️</Text>
        <VStack spacing="8px" textAlign="center">
          <Text color="white" fontSize="lg" fontWeight="bold">
            Sidebar Error
          </Text>
          <Button colorScheme="blue" onClick={handleRetry}>
            Try Again
          </Button>
        </VStack>
      </VStack>

      <VStack width="100%" px="12px" py="16px">
        <Button
          onClick={handleLogout}
          bg="transparent"
          color="#E53E3E"
          gap="12px"
          padding="10px 8px"
          alignItems="center"
          width="100%"
          justifyContent="flex-start"
          _hover={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <MdLogout size={20} />
          <Text fontWeight={500} fontSize={14}>
            Log out
          </Text>
        </Button>
      </VStack>
    </VStack>
  );

  return (
    <>
      <Box
        minW={isLargeScreen ? '280px' : 'auto'}
        borderRightColor="gray.200"
        bgColor="gray.50"
        h="100vh"
        position="sticky"
        zIndex="docked"
        top={0}
        left={0}
      >
        {isLargeScreen ? <SideBarErrorContent /> : <></>}
      </Box>

      <Drawer
        size="sideNav"
        placement="left"
        onClose={onCloseSideBar}
        isOpen={openSideBar}
      >
        <DrawerOverlay />
        <DrawerContent w="280px" position="relative">
          <SideBarErrorContent />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBarErrorFallback;
