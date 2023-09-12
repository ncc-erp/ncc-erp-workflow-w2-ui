import { HStack, Text } from '@chakra-ui/react';
import { SelectField } from 'common/components/SelectField';
import { option } from 'common/types';
import { ChangeEvent } from 'react';

interface PageSizeProps {
  noOfRows: option[];
  onChange: (value: number) => void;
}

export const PageSize = ({ noOfRows, onChange }: PageSizeProps) => {
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
        fontSize="sm"
        onChange={handleChange}
      />
    </HStack>
  );
};
