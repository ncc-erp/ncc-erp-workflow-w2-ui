import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  tablist: {
    border: '1px solid #EAECF0', // change the border
    gap: 4, // change the gap between the tabs
    borderRadius: 'md', // change the border radius
    bg: '#F9FAFB',
    padding: '1',
  },
  tab: {
    fontWeight: 'semibold', // change the font weight
    fontSize: '14px',
    lineHeight: '20px',
    color: '#667085',
    _selected: {
      bg: '#ffffff',
      color: '#344054',
      borderRadius: 'md',
      shadow: 'sm',
    },
  },
  tabpanels: {
    width: '100%',
    margin: '0px',
    padding: '0px',
  },
  tabpanel: {
    padding: '0px',
    margin: '0px',
  },
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
