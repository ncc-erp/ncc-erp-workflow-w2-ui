import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  thumb: {
    bg: '#F9FAFB',
  },
  track: {
    bg: '#EAECF0',
    _checked: {
      bg: '#17B26A',
    },
    _focus: {
      border: '2px solid #F2F4F7',
      borderRadius: 'full',
    },
    _disabled: {
      border: '2px solid #F2F4F7',
      borderRadius: 'full',
    },
  },
});

export const switchTheme = defineMultiStyleConfig({ baseStyle });
