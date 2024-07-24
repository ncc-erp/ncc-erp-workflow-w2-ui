import { Switch, SwitchProps } from '@chakra-ui/react';

interface CustomToggleProps extends SwitchProps {}

export const CustomToggle = ({ size = 'md', ...rest }: CustomToggleProps) => {
  return <Switch size={size} {...rest} />;
};
