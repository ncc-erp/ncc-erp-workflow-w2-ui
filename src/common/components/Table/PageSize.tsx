import { HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { SelectField } from 'common/components/SelectField';
import { ColorThemeMode } from 'common/constants';
import { option } from 'common/types';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const color = useColorModeValue(ColorThemeMode.DARK, ColorThemeMode.LIGHT);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(+event?.target.value);
  };

  return (
    <HStack spacing="12px">
      <Text whiteSpace="nowrap" fontSize="sm" color="paginationText">
        {t('PAGINATION.ROWS_PER_PAGE')}
      </Text>
      <SelectField
        isDisabled={isLoading}
        defaultValue={defaultValue}
        value={value}
        options={noOfRows}
        variant="outline"
        size="xs"
        fontSize="sm"
        onChange={handleChange}
        color={color}
        borderColor="border"
        bg="paginationBtnBg"
      />
    </HStack>
  );
};
