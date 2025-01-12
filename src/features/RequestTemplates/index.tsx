import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import Page from 'common/components/Page';
import { RequestTemplateTable } from './components/RequestTemplateTable';
import { useMemo } from 'react';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { removeItem } from 'utils';
import { useNavigate } from 'react-router';
import { LocalStorageKeys } from 'common/enums';

const RequestTemplates = () => {
  const { data, isLoading, refetch } = useRequestTemplates();
  const { hasPermission } = useUserPermissions();
  const navigate = useNavigate();

  const canViewTemplates = useMemo(
    () => hasPermission(Permissions.VIEW_WORKFLOW_DEFINITIONS),
    [hasPermission]
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
      <Page.Header>
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
