import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/400.css';
import { extendTheme } from '@chakra-ui/react';
import { menuTheme } from 'themes/menuTheme';
import { drawerTheme } from 'themes/drawerTheme';
import { getItem } from 'utils';

const themeLocal = getItem('chakra-ui-color-mode');

export const theme = extendTheme({
  config: {
    initialColorMode: themeLocal ?? 'light',
    useSystemColorMode: false,
  },
  fonts: {
    body: `'Montserrat'`,
    heading: `'Montserrat'`,
  },
  colors: {
    blackButton: {
      900: '#f9f9f9',
      800: 'rgba(0, 0, 0, 0.1)',
      700: '#252929',
      600: '#000000',
      500: '#414141',
      400: '#5c5c5c',
      300: '#767676',
      200: '#cccccc',
      100: '#b4b4b3',
    },
    primary: '#f16471',
    secondary: '#e2e8f0',
    hoverTableItemDark: '#212330',
    hoverTableItemLight: '#e2e8f0',
    colorTableItemDark: '#E2E8F0',
    colorTableItemLight: '#344054',
    tertiary: '#eff2f5',
    quarty: '#1a202c',
    light: '#f7fafc',
    dark: '#10151f',
    blue: {
      700: '#57a1da',
    },
    green: {
      700: '#36b08f',
    },
    red: {
      700: '#ee7782',
    },
    yellow: {
      700: '#edc172',
    },
    white: '#ffffff',
    blackBorder: {
      500: '#d2d2d2',
      600: '#585858',
    },
    borderDark: '#4D526D',
    borderLight: '#E2E8F0',
    TableHeaderLight: '#212330',
    TableHeaderDark: '#F2F4F7',
    actionMenuLightBg: '#2A2D3D',
    actionMenuBgLightHover: '#171923',
    actionMenuLightText: '#D0D5DD',
    actionMenuDarkBg: '#FFFFFF',
    actionMenuBgDarkHover: '#E2E8F0',
    actionMenuDarkText: '#344054',
    wine: {
      800: '#45263A',
    },
    disabledPageLight: '#98A2B3',
    stone: {
      50: '#F2F4F7',
      100: '#F0F1F5',
      200: '#EAECF0',
      300: '#E2E8F0',
      400: '#D0D5DD',
      500: '#BEC0C9',
      600: '#4D526D',
      700: '#344054',
      800: '#2A2D3D',
      900: '#212330',
      950: '#171923',
    },
    stoneAlpha: {
      '200/20': '#EAECF033',
    },
    ruby: {
      700: '#E53E3E',
      800: '#EC4755',
      900: '#B43A3F',
    },
  },
  components: {
    Menu: menuTheme,
    Drawer: drawerTheme,
  },
  semanticTokens: {
    colors: {
      sidebarBg: {
        default: 'wine.800',
        _dark: 'stone.900',
      },
      border: {
        default: 'stone.300',
        _dark: 'stone.600',
      },
      paginationBtnBg: {
        default: 'white',
        _dark: 'stone.900',
      },
      paginationBtnActiveBg: {
        default: 'stone.50',
        _dark: 'stone.800',
      },
      disabledPage: {
        default: 'disabledPageLight',
        _dark: 'stone.600',
      },
      paginationText: {
        default: 'stone.700',
        _dark: 'stone.400',
      },
      actionBtnBg: {
        default: 'stone.400',
        _dark: 'stone.700',
      },
    },
  },
  breakpoints: {
    emd: '1024px',
  },
});

export default theme;
