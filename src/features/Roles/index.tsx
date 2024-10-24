import Page from 'common/components/Page';
import { RolesBoard } from './components/RolesBoard';

const Roles = () => {
  return (
    <Page>
      <Page.Header>
        <Page.HeaderLeft>
          <Page.Heading>Roles Board</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <RolesBoard />
      </Page.Body>
    </Page>
  );
};

export default Roles;
