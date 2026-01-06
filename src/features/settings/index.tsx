import Page from 'common/components/Page';
import { ITSettings } from './components/ITGroupSettings';
import { HRSettings } from './components/HRGroupSettings';
import { CEOSettings } from './components/CEOGroupSettings';
import { DirectorSettings } from './components/DirectorGroupSettings';
import { SaleSettings } from './components/SaleGroupSettings';
import { HPMSettings } from './components/HPMGroupSettings';
import { SaoDoSettings } from './components/SaoDoGroupSettings';
import { AccountantSettings } from './components/AccountantGroupSettings';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';

const SettingsComponent = () => {
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isSmallScreen = useMediaQuery('(min-width: 480px)');
  const columnVisibility = useMemo(
    () => ({
      code: isSmallScreen,
    }),
    [isSmallScreen]
  );
  const canViewSettings = useMemo(
    () => hasPermission(Permissions.VIEW_SETTINGS),
    [hasPermission]
  );

  return canViewSettings ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>Settings</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <DirectorSettings columnVisibility={columnVisibility} />
        <HPMSettings />
        <ITSettings />
        <HRSettings />
        <CEOSettings />
        <SaleSettings />
        <SaoDoSettings />
        <AccountantSettings />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default SettingsComponent;
