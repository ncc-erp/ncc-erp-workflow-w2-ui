import Page from 'common/components/Page';
import { RolesBoard } from './components/RolesBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';

const Roles = () => {
  const { hasPermission } = useUserPermissions();

  const canViewRoles = useMemo(
    () => hasPermission(Permissions.VIEW_ROLES),
    [hasPermission]
  );

  return canViewRoles ? (
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
