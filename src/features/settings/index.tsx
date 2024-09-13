import Page from 'common/components/Page';
import { ITSettings } from './components/ITGroupSettings';
import { HRSettings } from './components/HRGroupSettings';
import { CEOSettings } from './components/CEOGroupSettings';
import { DirectorSettings } from './components/Director-Group-Settings';
import { SaleSettings } from './components/Sale-Group-Settings';

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
        <ITSettings />
        <HRSettings />
        <CEOSettings />
        <SaleSettings />
      </Page.Body>
    </Page>
  );
};

export default SettingsComponent;
