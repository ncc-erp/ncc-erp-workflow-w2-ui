import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const brandPrimary = defineStyle({
  background: '#F79009',
  color: 'white',
  fontFamily: 'roboto',
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: '600',
  _dark: {
    background: '#F79009',
    color: 'orange.800',
  },
  _placeholder: {
    background: '#F79009',
    color: 'white',
  },
  _hover: {
    background: '#FDB022',
    color: 'white',
  },
  _active: {
    background: '#FDB022',
    color: 'white',
  },
  _focus: {
    background: '#FDB022',
    color: 'white',
  },
  _disabled: {
    background: '#F2F4F7',
    color: '#98A2B3',
  },
});

const brandDestructive = defineStyle({
  background: '#D92D20',
  color: 'white',
  fontFamily: 'Roboto',
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: '600',

  _dark: {
    background: '#D92D20',
    color: 'white',
  },
  _hover: {
    background: '#B42318',
  },
  _active: {
    background: '#912018',
  },
  _focus: {
    background: '#D92D20',
  },
  _disabled: {
    background: '#F2F4F7',
    color: '#98A2B3',
    shadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  },
});

const brandSecondary = defineStyle({
  background: '#FFFFFF',
  color: '#344054',
  fontFamily: 'Roboto',
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: '600',
  border: '1px solid #EAECF0',
  _dark: {
    background: '#FFFFFF',
    color: '#344054',
  },

  _hover: {
    background: '#F9FAFB',
  },
  _active: {
    background: '#EAECF0',
  },

  _focus: {
    border: '2px solid #EAECF0',
  },

  _disabled: {
    background: '#FCFCFD',
    border: '1px solid #F2F4F7',
    color: '#667085',
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { brandPrimary, brandDestructive, brandSecondary },
});
