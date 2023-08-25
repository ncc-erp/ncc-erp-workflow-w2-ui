import {
  IconButton,
  ButtonProps,
  Icon,
  IconProps,
  Input,
  InputGroup,
  InputGroupProps,
  InputProps,
  InputRightElement,
  forwardRef,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import {
  InputWrapper,
  InputWrapperProps,
} from 'common/components/InputWrapper';

type PasswordFieldProps = InputProps &
  Omit<InputWrapperProps, 'children'> & {
    wrapperProps?: InputGroupProps;
    iconsProps?: IconProps;
    buttonProps?: ButtonProps;
  };

export const PasswordField = forwardRef(
  (
    {
      wrapperProps,
      iconsProps,
      buttonProps,
      error,
      label,
      ...inputProps
    }: PasswordFieldProps,
    ref
  ) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputWrapper label={label} error={error}>
        <InputGroup {...wrapperProps}>
          <Input {...inputProps} ref={ref} type={show ? 'text' : 'password'} />
          <InputRightElement h="full">
            <IconButton
              size="sm"
              variant="ghost"
              onClick={handleClick}
              aria-label=""
              {...buttonProps}
            >
              <Icon
                as={show ? IoEyeOutline : IoEyeOffOutline}
                color={'gray.600'}
                {...iconsProps}
              />
            </IconButton>
          </InputRightElement>
        </InputGroup>
      </InputWrapper>
    );
  }
);
