import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Icon,
  IconButton,
  Portal,
} from '@chakra-ui/react';
import { SideBarContent } from 'common/components/SideBar/SideBarContent';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { ReactNode, useEffect, useRef } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IoCloseOutline } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import { appConfigState, useSetAppConfig } from 'stores/appConfig';

interface PortalWrapperProps {
  children: ReactNode;
  shouldRenderInPortal: boolean;
}

export const SideNav = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const { openSideBar } = useRecoilValue(appConfigState);
  const { setSideBarWidth } = useSetAppConfig();
  const { onCloseSideBar, onOpenSideBar } = useSetAppConfig();
  const isLargeSceen = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    sideBarRef.current && setSideBarWidth(sideBarRef.current.offsetWidth);
  }, [setSideBarWidth, sideBarRef]);

  return (
    <>
      <Box
        ref={sideBarRef}
        w={isLargeSceen ? '240px' : 'auto'}
        borderRightColor="gray.200"
        bgColor="gray.50"
        h="100vh"
        position="sticky"
        zIndex="docked"
        top={0}
        left={0}
      >
        {isLargeSceen ? (
          <SideBarContent />
        ) : (
          <PortalWrapper shouldRenderInPortal={!isLargeSceen}>
            <IconButton
              size={{ base: 'md', md: 'sm' }}
              aria-label=""
              onClick={onOpenSideBar}
              position={{ base: 'fixed' }}
              rounded={{ base: 'md', md: 0 }}
              variant="ghost"
              bgColor="whiteAlpha.100"
              backdropFilter="auto"
              backdropBlur="4px"
              border={{ base: '1px', md: 0 }}
              borderColor="gray.100"
              top="10px"
              right="10px"
              aspectRatio="1/1"
            >
              <Icon fontSize="xl" as={HiMenuAlt2} />
            </IconButton>
          </PortalWrapper>
        )}
      </Box>
      <Drawer
        size="sideNav"
        placement="left"
        onClose={onCloseSideBar}
        isOpen={openSideBar}
      >
        <DrawerOverlay />
        <DrawerContent w="240px" position="relative">
          <SideBarContent />
          <IconButton
            aria-label=""
            position="absolute"
            variant="ghost"
            right="12px"
            top="20px"
            size="xs"
            onClick={onCloseSideBar}
          >
            <Icon fontSize="xl" as={IoCloseOutline} />
          </IconButton>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const PortalWrapper = ({
  shouldRenderInPortal,
  children,
}: PortalWrapperProps) => {
  return shouldRenderInPortal ? <Portal>{children}</Portal> : <>{children}</>;
};
