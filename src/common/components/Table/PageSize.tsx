import { HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { SelectField } from 'common/components/SelectField';
import { ColorThemeMode } from 'common/constants';
import { option } from 'common/types';
import { ChangeEvent } from 'react';

interface PageSizeProps {
  noOfRows: option[];
  onChange: (value: number) => void;
}

export const PageSize = ({ noOfRows, onChange }: PageSizeProps) => {
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);
  const bg = useColorModeValue(ColorThemeMode.LIGHT, ColorThemeMode.DARK);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(+event?.target.value);
  };

  return (
    <HStack spacing={0}>
      <Text whiteSpace="nowrap" fontSize="xs">
        No of rows
      </Text>
      <SelectField
        options={noOfRows}
        variant="ghost"
        size="xs"
        mt="-3px"
        ml="10px"
        fontSize="sm"
        onChange={handleChange}
        background={bg}
        color={color}
      />
    </HStack>
  );
};
