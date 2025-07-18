import { Box, Button, keyframes } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSyncUsers } from 'api/apiHooks/userHooks';
import { QueryKeys } from 'common/constants';
import { MdSync } from 'react-icons/md';
import { toast } from 'common/components/StandaloneToast';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SyncButton = () => {
  const queryClient = useQueryClient();
  const {
    mutateAsync: syncUsers,
    isLoading: isSyncingUsers,
    isError,
  } = useSyncUsers();

  const handleSync = async () => {
    await syncUsers(null);
    queryClient.invalidateQueries([QueryKeys.FILTER_USER]);
    toast({
      title: `${isError ? 'Fail' : 'Success'} Syncing Users`,
      status: isError ? 'error' : 'success',
    });
  };

  return (
    <Button
      style={{
        marginRight: '16px',
      }}
      onClick={handleSync}
      isDisabled={isSyncingUsers}
      aria-label=""
    >
      <Box
        as={MdSync}
        animation={
          isSyncingUsers ? `${spinAnimation} 1s infinite linear` : 'none'
        }
      />
    </Button>
  );
};

export default SyncButton;
