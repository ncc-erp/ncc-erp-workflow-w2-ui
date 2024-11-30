import Page from 'common/components/Page';
import { UserManagementTable } from './components/UserManagementTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';

const UserManagement = () => {
  const { hasPermission } = useUserPermissions();

  const canViewUsers = useMemo(
    () => hasPermission(Permissions.VIEW_USERS),
    [hasPermission]
  );

  return canViewUsers ? (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>User management</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <UserManagementTable />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default UserManagement;
