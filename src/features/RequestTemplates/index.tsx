import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import Page from 'common/components/Page';
import { RequestTemplateTable } from './components/RequestTemplateTable';
import { useMemo } from 'react';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';
import { removeItem } from 'utils';
import { useNavigate } from 'react-router';
import { LocalStorageKeys } from 'common/enums';

export interface IFilterPagination {
  skipCount: number;
  maxResultCount: number;
}

const RequestTemplates = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { hasPermission } = useUserPermissions();
  const navigate = useNavigate();

  const canViewTemplates = useMemo(
    () => hasPermission(Permissions.VIEW_WORKFLOW_DEFINITIONS),
    [hasPermission]
  );

  const canViewUnPublishedTemplates = useMemo(
    () => hasPermission(Permissions.UPDATE_WORKFLOW_DEFINITION_STATUS),
    [hasPermission]
  );

  const { data, isLoading, refetch } = useRequestTemplates(
    !canViewUnPublishedTemplates
  );

  const temp = useMemo(() => {
    return data;
  }, [data]);

  setTimeout(() => {
    if (!canViewTemplates) {
      removeItem(LocalStorageKeys.accessToken);
      navigate('/login');
    }
  }, 1000)
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
