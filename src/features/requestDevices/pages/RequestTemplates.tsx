import { Button } from '@chakra-ui/react';
import { LocalStorageKeys } from 'common/enums';
import { useNavigate } from 'react-router-dom';
import { removeItem } from 'utils/localStorage';

const RequestTemplates = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    removeItem(LocalStorageKeys.accessToken);
    navigate('/login');
  };

  return (
    <div>
      Request templates <Button onClick={onLogout}>Log out</Button>
    </div>
  );
};

export default RequestTemplates;
