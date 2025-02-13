import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  list: {
    borderRadius: 'lg',
    border: 'none',
    bg: 'light',
    shadow: '0px 3px 8px 0px hsla(211, 42%, 16%, 0.08)',
    p: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    _dark: {
      bg: 'stone.900',
    },
  },
  item: {
    rounded: '4px',
    bg: 'white',
    color: 'stone.700',
    _hover: {
      bg: 'gray.200',
      color: 'black',
    },
    _focus: {
      bg: 'gray.200',
      color: 'black',
    },
    _dark: {
      bg: 'stone.800',
      color: 'stone.400',
      _hover: {
        bg: 'stone.950',
      },
      _focus: {
        bg: 'stone.950',
      },
    },
  },
});

export const menuTheme = defineMultiStyleConfig({ baseStyle });
