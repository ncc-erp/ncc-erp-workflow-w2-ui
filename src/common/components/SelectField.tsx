import { Icon, Select, SelectProps, forwardRef } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { option } from 'common/types';

type SelectFieldFieldProps = SelectProps &
  Omit<InputWrapperProps, 'children'> & {
    options: option[];
  };

export const SelectField = forwardRef(
  ({ error, label, options, ...inputProps }: SelectFieldFieldProps, ref) => {
    return (
      <InputWrapper label={label} error={error}>
        <Select
          ref={ref}
          fontSize="sm"
          rounded="md"
          h = "40px"
          icon={<Icon as={RiArrowDropDownFill} />}
          {...inputProps}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </InputWrapper>
    );
  }
);
