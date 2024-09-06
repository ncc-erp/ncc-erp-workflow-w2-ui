import { StackItem } from '@chakra-ui/react';
import { Toggle } from '../Toogle';
import { CurrentUser } from '../CurrentUser';

export const PageHeaderRight = () => {
  return (
    <StackItem justifySelf="flex-end">
      <CurrentUser />
      <Toggle />
    </StackItem>
  );
};
