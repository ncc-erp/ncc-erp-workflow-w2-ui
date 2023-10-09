import { InputWrapperProps } from 'common/components/InputWrapper';
import { option } from 'common/types';
import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';

type SelectFieldFieldProps = Omit<InputWrapperProps, 'children'> & {
  value: string;
  name: string;
  control: Control;
  options: option[];
};

export const SearchableSelectField = ({
  options,
  name,
  control,
  value,
}: SelectFieldFieldProps) => {
  const initValue = useMemo(() => {
    return options.find((el) => el.value === value);
  }, [options, value]);

  if (!initValue) {
    return <></>;
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initValue}
      render={({ field }) => <Select {...field} options={options} />}
    />
  );
};
