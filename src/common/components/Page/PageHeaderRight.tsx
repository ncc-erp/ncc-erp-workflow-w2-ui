import { StackItem } from '@chakra-ui/react';
import { CurrentUser } from '../CurrentUser';
import { useMediaQuery } from 'hooks/useMediaQuery';

export const PageHeaderRight = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  return (
    <StackItem justifySelf="flex-end">
      {isLargeScreen && <CurrentUser isMobile={false} />}
    </StackItem>
  );
};
