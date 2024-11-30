import Page from 'common/components/Page';
import PermissonsBoard from './components/PermissionsBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useMemo } from 'react';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
const Permission = () => {
  const { hasPermission } = useUserPermissions();
  const canViewPerrmissions = useMemo(
    () => hasPermission(Permissions.VIEW_PERMISSIONS),
    [hasPermission]
  );
  return canViewPerrmissions ? (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Permissons Board</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <PermissonsBoard />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};
export default Permission;
