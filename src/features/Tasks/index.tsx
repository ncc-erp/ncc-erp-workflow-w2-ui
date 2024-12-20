import Page from 'common/components/Page';
import { TasksBoard } from './components/TasksBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useSetAppConfig } from 'stores/appConfig';
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
import theme from 'themes/theme';

const Tasks = () => {
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { onOpenSideBar } = useSetAppConfig();
  const bg = useColorModeValue(theme.colors.white, theme.colors.quarty);

  return hasPermission(Permissions.VIEW_TASKS) ? (
    <Page>
      {!isLargeScreen && (
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
            size={{ base: 'md', md: 'sm' }}
            aria-label=""
            onClick={onOpenSideBar}
            rounded={{ base: 'md', md: 0 }}
            variant="ghost"
            bgColor="whiteAlpha.100"
            backdropFilter="auto"
            backdropBlur="4px"
            border={{ base: '1px', md: 0 }}
            borderColor="gray.100"
            aspectRatio="1/1"
          >
            <Icon fontSize="xl" as={HiMenuAlt2} />
          </IconButton>
          <Box display={'flex'} gap={'8px'}>
            <Image h="24px" src={Logo} />
            <Heading fontSize="18px">NCC Workflow</Heading>
          </Box>
        </Box>
      )}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>Tasks Board</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <TasksBoard />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default Tasks;
