import { Button } from '@chakra-ui/react';
import { useRequestTemplates } from 'api/apiHooks/requestHooks';
import { useCurrentUser } from 'api/apiHooks/userHooks';
import { useNavigate } from 'react-router-dom';
import { useClearUserData } from 'stores/user';

const RequestTemplates = () => {
  const clearUser = useClearUserData();
  const navigate = useNavigate();
  const { remove } = useCurrentUser();
  const { data: requestTemplateData } = useRequestTemplates();

  const onLogout = () => {
    clearUser();
    navigate('/login');
    remove();
  };

  return (
    <div>
      Request templates {JSON.stringify(requestTemplateData, null, 2)}{' '}
      <Button onClick={onLogout}>Log out</Button>
    </div>
  );
};

export default RequestTemplates;
