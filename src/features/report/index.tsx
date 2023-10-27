import Page from 'common/components/Page';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from 'hooks/useIsAdmin';
import { TablePostAndWFH } from './components/PostAndWFHTable';

const PostAndWFH = () => {
  const isAdmin = useIsAdmin();

  return !isAdmin ? (
    <Navigate to="/" />
  ) : (
    <Page
      boxSizing="border-box"
    >
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
