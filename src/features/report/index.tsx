import Page from 'common/components/Page';
import { TablePostAndWFH } from './components/PostAndWFHTable';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { useMemo } from 'react';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';

const PostAndWFH = () => {
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  const columnVisibility = useMemo(
    () => ({
      creationTime: isMediumScreen,
      remoteDate: isMediumScreen,
    }),
    [isMediumScreen]
  );
  const isHasPermission = useMemo(
    () => hasPermission(Permissions.VIEW_WFH_REPORTS),
    [hasPermission]
  );

  return isHasPermission ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>Report WFH</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <TablePostAndWFH columnVisibility={columnVisibility} />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default PostAndWFH;
