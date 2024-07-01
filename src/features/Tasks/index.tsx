import Page from 'common/components/Page';
import { TasksBoard } from './components/TasksBoard';
import { usePageTracking } from 'hooks/useTrackingPage';

const Tasks = () => {
  usePageTracking();
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Tasks Board</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <TasksBoard />
      </Page.Body>
    </Page>
  );
};

export default Tasks;
