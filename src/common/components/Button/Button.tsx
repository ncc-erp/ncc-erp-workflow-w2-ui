import { Button, ButtonProps } from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant: 'brandPrimary' | 'brandDestructive' | 'brandSecondary';
}

export const CustomButton = ({
  children,
  variant,
  ...rest
}: CustomButtonProps) => {
  return (
    <Button {...rest} variant={variant}>
      {children}
    </Button>
  );
};
