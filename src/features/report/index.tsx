import Page from 'common/components/Page';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { TablePostAndWFH } from './components/PostAndWFHTable';
import { usePageTracking } from 'hooks/useTrackingPage';

const PostAndWFH = () => {
  const isAdmin = useIsAdmin();
  usePageTracking();

  return !isAdmin ? (
    <Navigate to="/" />
  ) : (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Report WFH</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <TablePostAndWFH />
      </Page.Body>
    </Page>
  );
};

export default PostAndWFH;
