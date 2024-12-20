import Page from 'common/components/Page';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { MyRequestTable } from './components/MyRequestTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useSetAppConfig } from 'stores/appConfig';
import { Box, Heading, Icon, IconButton, Image } from '@chakra-ui/react';
import { HiMenuAlt2 } from 'react-icons/hi';
import Logo from 'assets/images/ncc_logo.png';

const MyRequests = () => {
  const isAdmin = useIsAdmin();
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { onOpenSideBar } = useSetAppConfig();
  const canViewRequests = useMemo(
    () => hasPermission(Permissions.VIEW_WORKFLOW_INSTANCES),
    [hasPermission]
  );

  return canViewRequests ? (
    <Page>
      {!isLargeScreen && (
        <Box
          cursor="pointer"
          px="16px"
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
      >
        <Page.HeaderLeft>
          <Page.Heading>{isAdmin ? 'Requests' : 'My requests'}</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <MyRequestTable />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default MyRequests;
