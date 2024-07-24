import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const custom = definePartsStyle({
  control: defineStyle({
    padding: '4px',
    rounded: '4px',
    width: '20px',
    height: '20px',
  }),
});

export const checkboxTheme = defineMultiStyleConfig({
  variants: { custom },
});
