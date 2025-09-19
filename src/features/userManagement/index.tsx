import Page from 'common/components/Page';
import { UserManagementTable } from './components/UserManagementTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
  const { t } = useTranslation();
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const canViewUsers = useMemo(
    () => hasPermission(Permissions.VIEW_USERS),
    [hasPermission]
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
          <Page.Heading>
            {t('USER_MANAGEMENT_PAGE.USER_MANAGEMENT')}
          </Page.Heading>
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
