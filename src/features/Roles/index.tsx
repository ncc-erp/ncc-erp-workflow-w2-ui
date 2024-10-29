import Page from 'common/components/Page';
import { RolesBoard } from './components/RolesBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';

const Roles = () => {
  const { renderIfAllowed } = useUserPermissions();
  return (
    <>
      {renderIfAllowed(
        Permissions.VIEW_ROLES,
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
      )}
    </>
  );
};

export default Roles;
