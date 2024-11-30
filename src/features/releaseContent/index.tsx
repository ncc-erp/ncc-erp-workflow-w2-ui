import Page from 'common/components/Page';
import { ReleaseContentBody } from './components/ReleaseContentBody';

const ReleaseContent = () => {
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Releases Note</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <ReleaseContentBody />
      </Page.Body>
    </Page>
  );
};

export default ReleaseContent;
