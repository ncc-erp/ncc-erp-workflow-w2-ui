import { Spinner, useColorModeValue } from '@chakra-ui/react';
import { InputWrapperProps } from 'common/components/InputWrapper';
import { option } from 'common/types';
import { useMemo, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
import theme from 'themes/theme';

type SelectFieldFieldProps = Omit<InputWrapperProps, 'children'> & {
  value: string;
  name: string;
  control: Control;
  handleChange: (value: string, variable: string) => void;
  options: option[];
  isRequired: boolean;
};

const EmptyValue: option = {
  value: '',
  label: '',
};

export const SearchableSelectField = ({
  options,
  name,
  control,
  value,
  handleChange,
  isRequired,
}: SelectFieldFieldProps) => {
  const textColor = useColorModeValue(
    theme.colors.stone['700'],
    theme.colors.stone['300']
  );

  const menuListBg = useColorModeValue(
    theme.colors.white,
    theme.colors.gray['700']
  );

  const optionHoverBg = useColorModeValue(
    theme.colors.blue['100'],
    theme.colors.blue['400']
  );

  const initValue = useMemo(() => {
    const option = options.find((el) => {
      if (value && el?.value) {
        return el?.value?.toString().toLowerCase() === value.toLowerCase();
      }

      return el.value === value;
    });

    return option ?? { value: '', label: '' };
  }, [options, value]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const displayValue = useMemo(() => {
    return isMenuOpen ? EmptyValue : initValue;
  }, [isMenuOpen, initValue]);

  if (!initValue) {
    return <Spinner color="red.500" size="md" />;
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initValue}
      rules={{
        validate: () => {
          if (isRequired && displayValue?.value === '') {
            return `${name} is Required`;
          }

          return true; // Giá trị hợp lệ
        },
      }}
      render={({ field }) => (
        <Select
          {...field}
          onChange={(e) => {
            field.onChange(e);
            handleChange(e?.value as string, name);
          }}
          onMenuOpen={() => {
            setIsMenuOpen(true);
          }}
          onMenuClose={() => {
            setIsMenuOpen(false);
          }}
          value={displayValue}
          options={options}
          styles={{
            control: (base, props) => {
              return {
                ...base,
                backgroundColor: 'transparent',
                borderColor: 'inherit',
                boxShadow: props.isFocused
                  ? `0 0 0 1px ${theme.colors.blue['300']}`
                  : undefined,
                '&:hover': {
                  borderColor: props.isFocused
                    ? theme.colors.blue['300']
                    : undefined,
                },
              };
            },
            singleValue: (base) => {
              return {
                ...base,
                color: textColor,
              };
            },
            input: (base) => {
              return {
                ...base,
                color: textColor,
              };
            },
            dropdownIndicator: (base) => {
              return {
                ...base,
                color: textColor,
              };
            },
            indicatorSeparator: (base) => {
              return {
                ...base,
                backgroundColor: 'var(--chakra-colors-chakra-border-color)',
              };
            },
            menuList: (base) => {
              return {
                ...base,
                backgroundColor: menuListBg,
              };
            },
            option: (base, props) => {
              console.log(props.isSelected, props.data);

              return {
                ...base,
                color: textColor,
                '&:hover, &:focus': {
                  backgroundColor: optionHoverBg,
                },
                backgroundColor: props.isFocused ? optionHoverBg : undefined,
              };
            },
          }}
        />
      )}
    />
  );
};
