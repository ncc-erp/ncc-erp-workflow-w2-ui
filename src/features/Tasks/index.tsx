import Page from 'common/components/Page';
import { TasksBoard } from './components/TasksBoard';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { Permissions } from 'common/constants';
import NotFound from 'common/components/NotFound';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';
import { useTranslation } from 'react-i18next';

const Tasks = () => {
  const { hasPermission } = useUserPermissions();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { t } = useTranslation();

  return hasPermission(Permissions.VIEW_TASKS) ? (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>{t('TASKS_PAGE.PAGE_TITLE')}</Page.Heading>
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
