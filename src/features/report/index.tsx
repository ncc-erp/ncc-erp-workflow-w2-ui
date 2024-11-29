import Page from 'common/components/Page';
import { TablePostAndWFH } from './components/PostAndWFHTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useMemo } from 'react';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';

const PostAndWFH = () => {
  const { hasPermission } = useUserPermissions();

  const isHasPermission = useMemo(
    () => hasPermission(Permissions.VIEW_WFH_REPORTS),
    [hasPermission]
  );

  return isHasPermission ? (
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
  ) : (
    <NotFound />
  );
};

export default PostAndWFH;
