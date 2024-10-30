import Page from 'common/components/Page';
import { RolesBoard } from './components/RolesBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';

const Roles = () => {
  const { hasPermission } = useUserPermissions();

  return hasPermission(Permissions.VIEW_ROLES) ? (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Roles Board</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <RolesBoard />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default Roles;
