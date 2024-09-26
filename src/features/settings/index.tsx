import Page from 'common/components/Page';
import { ITSettings } from './components/ITGroupSettings';
import { HRSettings } from './components/HRGroupSettings';
import { CEOSettings } from './components/CEOGroupSettings';
import { DirectorSettings } from './components/DirectorGroupSettings';
import { SaleSettings } from './components/SaleGroupSettings';
import { HPMSettings } from './components/HPMGroupSettings';
import { SaoDoSettings } from './components/SaoDoGroupSettings';
import { AccountantSettings } from './components/AccountantGroupSettings';
const SettingsComponent = () => {
  return (
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
  );
};

export default SettingsComponent;
