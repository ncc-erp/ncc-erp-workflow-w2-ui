import Page from 'common/components/Page';
import PermissonsBoard from './components/PermissionsBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useMemo } from 'react';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';
import { useTranslation } from 'react-i18next';

const Permission = () => {
  const { t } = useTranslation();
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const canViewPerrmissions = useMemo(
    () => hasPermission(Permissions.VIEW_PERMISSIONS),
    [hasPermission]
  );
  return canViewPerrmissions ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>{t('PERMISSIONS_PAGE.PAGE_TITLE')}</Page.Heading>
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
