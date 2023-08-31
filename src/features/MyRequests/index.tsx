import Page from 'common/components/Page';
import { MyRequestBoard } from './components/MyRequestBoard';

const MyRequests = () => {
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>My requests</Page.Heading>
        </Page.HeaderLeft>
      </Page.Header>

      <Page.Body>
        <MyRequestBoard />
      </Page.Body>
    </Page>
  );
};

export default MyRequests;
