import { Switch, SwitchProps } from '@chakra-ui/react';

interface CustomToggleProps extends SwitchProps {
  state?: 'default' | 'focus' | 'disabled';
}

export const CustomToggle = ({
  isChecked,
  state = 'default',
  size = 'md',
  ...rest
}: CustomToggleProps) => {
  const borderColor = state === ('disabled' || 'focus') ? '#F2F4F7' : '#EAECF0';

  return (
    <Switch
      size={size}
      isChecked={isChecked}
      disabled={state === 'disabled'}
      borderRadius={100}
      borderWidth={2}
      borderColor={borderColor}
      {...rest}
    />
  );
};
