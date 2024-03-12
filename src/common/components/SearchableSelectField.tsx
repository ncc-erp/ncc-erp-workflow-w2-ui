import { Spinner } from '@chakra-ui/react';
import { InputWrapperProps } from 'common/components/InputWrapper';
import { option } from 'common/types';
import { useMemo, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
import { convertToCase } from 'utils';

type SelectFieldProps = Omit<InputWrapperProps, 'children'> & {
  value: string;
  name: string;
  control: Control;
  handleChange: (value: string, variable: string) => void;
  options: option[];
  isRequired: boolean;
  watch: (names?: string | string[]) => unknown;
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
  watch,
}: SelectFieldProps) => {
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
        required: isRequired ? `${convertToCase(name)} is Required` : false,
        validate: () => {
          if (!isRequired) {
            return true;
          }

          const selected = watch(name) as option;
          if (!selected || (selected?.value as string).trim() === '') {
            return `${convertToCase(name)} is Required`;
          }

          if (name === 'DestinationOffice') {
            const target = watch('CurrentOffice') as option;

            if (!target || selected?.value === target?.value) {
              return `${convertToCase(name)} is Not Valid!`;
            }
          }

          return true;
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
        />
      )}
    />
  );
};
