import { alertAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(alertAnatomy.keys);

const customVariant = definePartsStyle({
  container: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.50',

    _dark: {
      borderColor: 'gray.600',
      background: 'gray.800',
    },
  },
  title: {
    color: 'teal.500',
    _dark: {
      color: 'cyan.400',
    },
  },
});

export const alertTheme = defineMultiStyleConfig({
  variants: { custom: customVariant },
});
