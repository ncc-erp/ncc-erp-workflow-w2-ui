import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import Page from 'common/components/Page';
import { RequestTemplateTable } from './components/RequestTemplateTable';
import { useMemo } from 'react';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';

export interface IFilterPagination {
  skipCount: number;
  maxResultCount: number;
}

const RequestTemplates = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { data, isLoading, refetch } = useRequestTemplates(true);
  const { hasPermission } = useUserPermissions();

  const canViewTemplates = useMemo(
    () => hasPermission(Permissions.VIEW_WORKFLOW_DEFINITIONS),
    [hasPermission]
  );

  const temp = useMemo(() => {
    return data;
  }, [data]);

  return canViewTemplates ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>Request Templates</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <RequestTemplateTable
          data={temp || { items: [], totalCount: 0 }}
          isLoading={isLoading}
          refetch={refetch}
        />
      </Page.Body>
    </Page>
  ) : (
    <NotFound />
  );
};

export default RequestTemplates;
