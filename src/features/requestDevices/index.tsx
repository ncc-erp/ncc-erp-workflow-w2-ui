import Page from 'common/components/Page';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { MyRequestTable } from './components/MyRequestTable';

const MyRequests = () => {
  const isAdmin = useIsAdmin();
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>{isAdmin ? 'Requests' : 'My requests'}</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <MyRequestTable />
      </Page.Body>
    </Page>
  );
};

export default MyRequests;
