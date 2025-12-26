import { Box, Icon, Text, useDisclosure, Portal } from '@chakra-ui/react';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { option } from 'common/types';
import { forwardRef, useState, useRef, useEffect } from 'react';

type SelectFieldFieldProps = Omit<InputWrapperProps, 'children'> & {
  options: option[];
  value?: string | number;
  onChange?: (event: { target: { value: string } }) => void;
  placeholder?: string;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rounded?: string;
  fontSize?: string;
  h?: string;
  isTruncated?: boolean;
  pageSize?: number;
  minW?: string | number;
  cursor?: string;
  defaultValue?: number | undefined;
  variant?: string;
  color?: string;
  borderColor?: string;
  bg?: string;
};

export const SelectField = forwardRef<HTMLDivElement, SelectFieldFieldProps>(
  ({
    error,
    label,
    options,
    value = '',
    onChange,
    placeholder = 'Select option',
    isDisabled = false,
    rounded = 'md',
    fontSize = 'sm',
    h = '40px',
    isTruncated = true,

    minW,
    cursor = 'pointer',
    ...props
  }) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [selectedValue, setSelectedValue] = useState<string | number>(value);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    const displayText = selectedOption?.label || placeholder;

    useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);

    const handleOptionClick = (optionValue: string | number) => {
      setSelectedValue(optionValue);

      onChange?.({ target: { value: String(optionValue) } });
      onClose();
    };

    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
    });

    useEffect(() => {
      if (isOpen && selectRef.current) {
        const rect = selectRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }, [isOpen]);

    return (
      <InputWrapper label={label} error={error} {...props}>
        <Box position="relative" minW={minW}>
          <Box
            ref={selectRef}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            h={h}
            px="12px"
            border="1px solid"
            borderColor={error ? 'red.500' : 'gray.200'}
            borderRadius={rounded}
            bg={isDisabled ? 'gray.100' : 'white'}
            cursor={isDisabled ? 'not-allowed' : cursor}
            fontSize={fontSize}
            color={selectedValue ? 'gray.900' : 'gray.400'}
            minW={minW}
            _hover={{
              borderColor: isDisabled ? 'gray.200' : 'gray.300',
            }}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: '0 0 0 1px #3182ce',
            }}
            onClick={isDisabled ? undefined : onToggle}
            tabIndex={isDisabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isDisabled) onToggle();
              }
            }}
          >
            <Text isTruncated={isTruncated} flex="1">
              {displayText}
            </Text>
            <Icon
              as={RiArrowDropDownFill}
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="transform 0.2s"
              ml="8px"
              flexShrink={0}
            />
          </Box>

          {isOpen && (
            <Portal>
              <Box
                ref={dropdownRef}
                position="absolute"
                top={`${dropdownPosition.top}px`}
                left={`${dropdownPosition.left}px`}
                width={`${dropdownPosition.width}px`}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius={rounded}
                boxShadow="lg"
                zIndex={1000}
                maxH="200px"
                overflowY="auto"
                py="4px"
              >
                {options.map(({ value: optionValue, label: optionLabel }) => (
                  <Box
                    key={String(optionValue)}
                    px="12px"
                    py="8px"
                    fontSize={fontSize}
                    cursor="pointer"
                    bg={
                      selectedValue === optionValue ? 'blue.50' : 'transparent'
                    }
                    color={
                      selectedValue === optionValue ? 'blue.600' : 'gray.900'
                    }
                    _hover={{
                      bg:
                        selectedValue === optionValue ? 'blue.100' : 'gray.50',
                    }}
                    onClick={() => handleOptionClick(optionValue)}
                  >
                    <Text isTruncated>{optionLabel}</Text>
                  </Box>
                ))}
              </Box>
            </Portal>
          )}
        </Box>
      </InputWrapper>
    );
  }
);

SelectField.displayName = 'SelectField';
