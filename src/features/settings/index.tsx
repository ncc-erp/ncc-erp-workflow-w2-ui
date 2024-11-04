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

const SettingsComponent = () => {
  const { hasPermission } = useUserPermissions();

  const canViewSettings = useMemo(
    () => hasPermission(Permissions.VIEW_SETTINGS),
    [hasPermission]
  );

  return canViewSettings ? (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Settings</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <DirectorSettings />
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
