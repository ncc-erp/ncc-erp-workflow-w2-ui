import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import Page from 'common/components/Page';
import { RequestTemplateTable } from './components/RequestTemplateTable';

const RequestTemplates = () => {
  const { data, isLoading } = useRequestTemplates();

  console.log('Request data::: ', data);
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Requests Template</Page.Heading>
        </Page.HeaderLeft>
      </Page.Header>

      <Page.Body>
        <RequestTemplateTable
          data={data || { items: [], totalCount: 0 }}
          isLoading={isLoading}
        />
      </Page.Body>
    </Page>
  );
};

export default RequestTemplates;
