import { Box, Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { SideBarContent } from 'common/components/SideBar/SideBarContent';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { appConfigState, useSetAppConfig } from 'stores/appConfig';

interface SideNavProps {
  isLargeScreen: boolean;
}

export const SideNav = ({ isLargeScreen }: SideNavProps) => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const { openSideBar, isInMezon } = useRecoilValue(appConfigState);
  const { setSideBarWidth } = useSetAppConfig();
  const { onCloseSideBar } = useSetAppConfig();
  useEffect(() => {
    sideBarRef.current && setSideBarWidth(sideBarRef.current.offsetWidth);
  }, [setSideBarWidth, sideBarRef]);
  return (
    <>
      <Box
        ref={sideBarRef}
        minW={isLargeScreen ? '280px' : 'auto'}
        borderRightColor="gray.200"
        bgColor="gray.50"
        h="100vh"
        position="sticky"
        zIndex="docked"
        top={0}
        left={0}
      >
        {isLargeScreen ? (
          <SideBarContent isLargeScreen={isLargeScreen} isInMezon={isInMezon} />
        ) : (
          <></>
        )}
      </Box>
      <Drawer
        size="sideNav"
        placement="left"
        onClose={onCloseSideBar}
        isOpen={openSideBar}
      >
        <DrawerOverlay />
        <DrawerContent w="280px" position="relative">
          <SideBarContent isLargeScreen={isLargeScreen} isInMezon={isInMezon} />
          {/* <IconButton
            aria-label=""
            position="absolute"
            variant="ghost"
            right="12px"
            top="20px"
            size="xs"
            onClick={onCloseSideBar}
          >
            <Icon fontSize="xl" as={IoCloseOutline} />
          </IconButton> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};
