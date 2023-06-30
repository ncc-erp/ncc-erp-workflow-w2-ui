import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Icon,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react';
import { SideBarContent } from 'common/components/SideBar/SideBarContent';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IoCloseOutline } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import { appConfigState, useSetAppConfig } from 'stores/appConfig';

export const SideNav = () => {
  const { openSideBar } = useRecoilValue(appConfigState);
  const { onCloseSideBar, onOpenSideBar } = useSetAppConfig();
  const [isLargeSceen] = useMediaQuery(['(min-width: 62em)']); // https://chakra-ui.com/docs/styled-system/theme

  return (
    <>
      <Box
        w={isLargeSceen ? '240px' : 'auto'}
        borderRightWidth='1px'
        borderRightColor='gray.200'
        bgColor='gray.50'
        h='100vh'
      >
        {isLargeSceen ? (
          <SideBarContent />
        ) : (
          <IconButton
            size={{ base: 'md', md: 'sm' }}
            aria-label=''
            onClick={onOpenSideBar}
            position={{ base: 'fixed', md: 'initial' }}
            rounded={{ base: 'md', md: 0 }}
            variant='ghost'
            bgColor='whiteAlpha.100'
            backdropFilter='auto'
            backdropBlur='4px'
            border={{ base: '1px', md: 0 }}
            borderColor='gray.100'
            top='10px'
            left='10px'
            aspectRatio='1/1'
            zIndex='overlay'
          >
            <Icon fontSize='xl' as={HiMenuAlt2} />
          </IconButton>
        )}
      </Box>
      <Drawer
        size='sideNav'
        placement='left'
        onClose={onCloseSideBar}
        isOpen={openSideBar}
      >
        <DrawerOverlay />
        <DrawerContent w='240px' position='relative'>
          <SideBarContent />
          <IconButton
            aria-label=''
            position='absolute'
            variant='ghost'
            right='12px'
            top='20px'
            size='xs'
            onClick={onCloseSideBar}
          >
            <Icon fontSize='xl' as={IoCloseOutline} />
          </IconButton>
        </DrawerContent>
      </Drawer>
    </>
  );
};
