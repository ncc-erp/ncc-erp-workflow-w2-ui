import Page from 'common/components/Page';
import { TasksBoard } from './components/TasksBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';

const Tasks = () => {
  const { hasPermission } = useUserPermissions();

  return hasPermission(Permissions.VIEW_TASKS) ? (
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
  ) : (
    <NotFound />
  );
};

export default Tasks;
