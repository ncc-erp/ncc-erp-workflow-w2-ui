import Page from 'common/components/Page';
import { DIRECTORSettings } from './components/DIRECTORGroupSettings';
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
        <DIRECTORSettings />
        <ITSettings />
        <HRSettings />
        <CEOSettings />
        <SALESettings />
      </Page.Body>
    </Page>
  );
};

export default SettingsComponent;
