import Page from 'common/components/Page';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { MyRequestTable } from './components/MyRequestTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';

const MyRequests = () => {
  const isAdmin = useIsAdmin();
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const canViewRequests = useMemo(
    () => hasPermission(Permissions.VIEW_WORKFLOW_INSTANCES),
    [hasPermission]
  );

  return canViewRequests ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
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
