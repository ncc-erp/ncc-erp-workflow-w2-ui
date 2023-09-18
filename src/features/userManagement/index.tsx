import Page from 'common/components/Page';
import { UserManagementTable } from './components/UserManagementTable';

const UserManagement = () => {
  return (
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
  );
};

export default UserManagement;
