import { Checkbox, CheckboxProps } from '@chakra-ui/react';

interface CustomCheckboxProps extends CheckboxProps {}

export const CustomCheckbox = ({ ...rest }: CustomCheckboxProps) => {
  const borderColor = rest._checked ? '#344054' : '#EAECF0';
  return (
    <Checkbox
      {...rest}
      borderColor={borderColor}
      _checked={{
        '& .chakra-checkbox__control': { background: '#344054' },
        borderColor: '#344054',
      }}
      variant={'custom'}
    />
  );
};
