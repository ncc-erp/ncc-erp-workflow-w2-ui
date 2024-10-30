import Page from 'common/components/Page';
import { UserManagementTable } from './components/UserManagementTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';

const UserManagement = () => {
  const { hasPermission } = useUserPermissions();

  return hasPermission(Permissions.VIEW_USERS) ? (
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
