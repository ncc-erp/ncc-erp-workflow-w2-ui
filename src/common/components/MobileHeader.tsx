import {
  Box,
  Heading,
  Icon,
  IconButton,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { HiMenuAlt2 } from 'react-icons/hi';
import Logo from 'assets/images/ncc_logo.png';
import { useSetAppConfig } from 'stores/appConfig';
import theme from 'themes/theme';

export const MobileHeader = () => {
  const { onOpenSideBar } = useSetAppConfig();
  const bg = useColorModeValue(theme.colors.white, theme.colors.quarty);

  return (
    <Box
      position={{ base: 'fixed' }}
      top="0px"
      left="0px"
      right="0px"
      cursor="pointer"
      zIndex={100}
      backgroundColor={bg}
      px="16px"
      pb={'20px'}
      pt={'20px'}
      display={'flex'}
      alignItems={'center'}
      gap={'16px'}
    >
      <IconButton
        size="md"
        aria-label=""
        onClick={onOpenSideBar}
        rounded="md"
        variant="ghost"
        backdropFilter="auto"
        backdropBlur="4px"
        border="1px"
        borderColor="border"
        aspectRatio="1/1"
      >
        <Icon fontSize="xl" as={HiMenuAlt2} />
      </IconButton>
      <Box display={'flex'} gap={'8px'}>
        <Image h="24px" src={Logo} />
        <Heading fontSize="18px">NCC Workflow</Heading>
      </Box>
    </Box>
  );
};
