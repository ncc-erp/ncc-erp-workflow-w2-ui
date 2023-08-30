import Page from 'common/components/Page';
import { MyRequestTable } from './components/MyRequestTable';

const MyRequests = () => {
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>My requests</Page.Heading>
        </Page.HeaderLeft>
      </Page.Header>
      <Page.Body>
        <MyRequestTable />
      </Page.Body>
    </Page>
  );
};

export default MyRequests;
