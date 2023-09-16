import Page from 'common/components/Page';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { TablePostAndWFH } from './PostAndWFHTable';

const PostAndWFH = () => {
  const isAdmin = useIsAdmin();

  return !isAdmin ? (
    <Navigate to="/" />
  ) : (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>My requests</Page.Heading>
        </Page.HeaderLeft>
      </Page.Header>
      <Page.Body>
        <TablePostAndWFH />
      </Page.Body>
    </Page>
  );
};

export default PostAndWFH;
