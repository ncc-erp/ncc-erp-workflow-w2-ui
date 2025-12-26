import Page from 'common/components/Page';
import { UserManagementTable } from './components/UserManagementTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';

const UserManagement = () => {
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const canViewUsers = useMemo(
    () => hasPermission(Permissions.VIEW_USERS),
    [hasPermission]
  );
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  const isSmallScreen = useMediaQuery('(min-width: 480px)');
  const columnVisibility = useMemo(
    () => ({
      lastModificationTime: isMediumScreen,
      creationTime: isMediumScreen,
      mezonUserId: isMediumScreen,
      roles: isMediumScreen,
      email: isSmallScreen,
    }),
    [isMediumScreen, isSmallScreen]
  );
  return canViewUsers ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>User management</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <UserManagementTable columnVisibility={columnVisibility} />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default UserManagement;
