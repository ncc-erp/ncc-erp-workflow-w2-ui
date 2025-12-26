import Page from 'common/components/Page';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMemo } from 'react';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';
import { WebhooksBoard } from './components/WebhooksBoard';

const Webhooks = () => {
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  const columnVisibility = useMemo(
    () => ({
      url: isMediumScreen,
    }),
    [isMediumScreen]
  );
  const canViewWebhook = useMemo(
    () => hasPermission(Permissions.VIEW_WEBHOOKS),
    [hasPermission]
  );

  return canViewWebhook ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>Webhooks Board</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <WebhooksBoard columnVisibility={columnVisibility} />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default Webhooks;
