import React from 'react';
import { Select, FormControl, FormLabel, SelectProps } from '@chakra-ui/react';
interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  customStyles?: SelectProps;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  customStyles,
}) => {
  return (
    <FormControl>
      <FormLabel fontSize="14px">{label}</FormLabel>
      <Select
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        {...customStyles}
        bgColor="#ffffff"
        borderColor="#D0D5DD"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
