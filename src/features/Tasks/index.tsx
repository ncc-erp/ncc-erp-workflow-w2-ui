import Page from 'common/components/Page';
import { TasksBoard } from './components/TasksBoard';

const Tasks = () => {
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Tasks Board</Page.Heading>
        </Page.HeaderLeft>
      </Page.Header>

      <Page.Body>
        <TasksBoard />
      </Page.Body>
    </Page>
  );
};

export default Tasks;
