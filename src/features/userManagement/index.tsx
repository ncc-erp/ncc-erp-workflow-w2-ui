import Page from 'common/components/Page';
import { UserManagementTable } from './UserManagementTable';

const UserManagement = () => {
    return (
        <Page>
            <Page.Header>
                <Page.HeaderLeft>
                    <Page.Heading>User</Page.Heading>
                </Page.HeaderLeft>
            </Page.Header>
            <Page.Body>
                <UserManagementTable />
            </Page.Body>
        </Page>
    );
};

export default UserManagement;
