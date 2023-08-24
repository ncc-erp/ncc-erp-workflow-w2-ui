import { Button } from '@chakra-ui/react';
import { useCurrentUser } from 'api/apiHooks/userHooks';
import { useNavigate } from 'react-router-dom';
import { useClearUserData } from 'stores/user';

const RequestTemplates = () => {
	const clearUser = useClearUserData();
	const navigate = useNavigate();
	const { remove } = useCurrentUser();

	const onLogout = () => {
		clearUser();
		navigate('/login');
		remove();
	};

	return (
		<div>
			Request templates <Button onClick={onLogout}>Log out</Button>
		</div>
	);
};

export default RequestTemplates;
