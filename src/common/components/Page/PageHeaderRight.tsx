import { Flex, StackItem } from '@chakra-ui/react';
import { CurrentUser } from '../CurrentUser';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useIsAdmin } from 'hooks/useIsAdmin';
import SyncButton from '../SyncButton';

export const PageHeaderRight = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isAdmin = useIsAdmin();

  return (
    <StackItem justifySelf="flex-end">
      <Flex alignItems="center">
        {isAdmin && <SyncButton />}
        {isLargeScreen && <CurrentUser isMobile={false} />}
      </Flex>
    </StackItem>
  );
};
