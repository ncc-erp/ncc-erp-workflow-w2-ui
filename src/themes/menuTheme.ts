import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  list: {
    borderRadius: 'lg',
    border: 'none',
    bg: 'white',
    shadow: '0px 3px 8px 0px hsla(211, 42%, 16%, 0.08)',
    p: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  item: {
    rounded: '4px',
    _hover: {
      bg: 'gray.200',
      color: 'black',
    },
    _focus: {
      bg: 'gray.200',
      color: 'black',
    },
  },
});

export const menuTheme = defineMultiStyleConfig({ baseStyle });
