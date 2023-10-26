import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import Page from 'common/components/Page';
import { RequestTemplateTable } from './components/RequestTemplateTable';
import { useMemo } from 'react';

const RequestTemplates = () => {
  const { data, isLoading, refetch } = useRequestTemplates();

  const temp = useMemo(() => {
    return data;
  }, [data]);
  return (
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
  );
};

export default RequestTemplates;
