import Page from 'common/components/Page';
import { GDVPSettings } from './components/GDVPSettings';
import { ITSettings } from './components/ITGroupSettings';
import { HRSettings } from './components/HRGroupSettings';
import { CEOSettings } from './components/CEOGroupSettings';
import { SALESettings } from './components/SALEGroupSettings';

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
        <GDVPSettings />
        <ITSettings />
        <HRSettings />
        <CEOSettings />
        <SALESettings />
      </Page.Body>
    </Page>
  );
};

export default SettingsComponent;
