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
  },
  item: {
    _hover: {
      bg: 'none',
    },
    _focus: {
      bg: 'none',
    },
  },
});

export const menuTheme = defineMultiStyleConfig({ baseStyle });
