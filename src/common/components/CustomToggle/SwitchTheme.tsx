import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    bg: '#F2F4F7',
    _checked: {
      bg: '#F2F4F7',
    },
  },
  thumb: {
    bg: '#F9FAFB',
  },
  track: {
    bg: '#EAECF0',
    _checked: {
      bg: 'gray.700',
    },
  },
});

export const switchTheme = defineMultiStyleConfig({ baseStyle });
