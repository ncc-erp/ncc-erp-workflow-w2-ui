import { useMyRequests } from 'api/apiHooks/requestHooks';
import Boards from 'common/components/Boards';
import Page from 'common/components/Page';
import { noOfRows } from 'common/constants';
import { RequestSortField } from 'common/enums';

const MyRequests = () => {
  const { data } = useMyRequests({
    Status: '',
    WorkflowDefinitionId: '',
    sorting: [RequestSortField.createdAt, 'desc'].join(' '),
    skipCount: 0,
    maxResultCount: +noOfRows[0].value,
  });

  if (!data) {
    return <></>;
  }

  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>My requests</Page.Heading>
        </Page.HeaderLeft>
      </Page.Header>

      <Page.Body>
        <Boards data={data} />
      </Page.Body>

      {/* <Page.Body>
        <MyRequestTable />
      </Page.Body> */}
    </Page>
  );
};

export default MyRequests;
