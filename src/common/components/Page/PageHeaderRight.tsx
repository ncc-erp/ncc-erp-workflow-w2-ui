import { StackItem } from '@chakra-ui/react';
import { Toggle } from '../Toogle';

export const PageHeaderRight = () => {
  return (
    <StackItem justifySelf="flex-end">
      <Toggle />
    </StackItem>
  );
};
