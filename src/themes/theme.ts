import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/400.css';
import { extendTheme } from '@chakra-ui/react';
import { menuTheme } from 'themes/menuTheme';
import { drawerTheme } from 'themes/drawerTheme';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
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
    light: '#f7fafc',
    dark: '#10151f',
    tertiary: '#f2f0f0',
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
  },
  components: {
    Menu: menuTheme,
    Drawer: drawerTheme,
  },
});

export default theme;
