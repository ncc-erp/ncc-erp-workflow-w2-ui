import { HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { SelectField } from 'common/components/SelectField';
import { ColorThemeMode } from 'common/constants';

import { option } from 'common/types';

interface PageSizeProps {
  noOfRows: option[];
  onChange: (value: number) => void;
  defaultValue?: number;
  value?: number;
  isLoading?: boolean;
}

export const PageSize = ({
  noOfRows,
  onChange,
  defaultValue,
  value,
  isLoading,
}: PageSizeProps) => {
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const handleChange = (event: { target: { value: string } }) => {
    onChange(+event.target.value);
  };

  return (
    <HStack spacing="12px">
      <Text whiteSpace="nowrap" fontSize="sm" color="paginationText">
        Rows per page:
      </Text>
      <SelectField
        isDisabled={isLoading}
        defaultValue={defaultValue}
        value={value}
        options={noOfRows}
        variant="outline"
        size="sm"
        fontSize="sm"
        onChange={handleChange}
        color={color}
        borderColor="border"
        bg="paginationBtnBg"
      />
    </HStack>
  );
};
