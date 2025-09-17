import { Flex, StackItem } from '@chakra-ui/react';
import { CurrentUser } from '../CurrentUser';
import { useMediaQuery } from 'hooks/useMediaQuery';
import SyncButton from '../SyncButton';
import { Permissions } from 'common/constants';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const PageHeaderRight = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const { hasPermission } = useUserPermissions();

  return (
    <StackItem justifySelf="flex-end">
      <Flex alignItems="center">
        <LanguageSwitcher />
        {isLargeScreen && hasPermission(Permissions.UPDATE_USER) && (
          <SyncButton />
        )}
        {isLargeScreen && <CurrentUser isMobile={false} />}
      </Flex>
    </StackItem>
  );
};
