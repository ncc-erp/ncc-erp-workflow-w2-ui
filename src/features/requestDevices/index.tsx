import Page from 'common/components/Page';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { MyRequestTable } from './components/MyRequestTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';

const MyRequests = () => {
  const isAdmin = useIsAdmin();
  const { hasPermission } = useUserPermissions();

  const canViewRequests = useMemo(
    () => hasPermission(Permissions.VIEW_WORKFLOW_INSTANCES),
    [hasPermission]
  );

  return canViewRequests ? (
    <Page>
      <Page.Header>
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
