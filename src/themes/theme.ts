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
      700: '#252929',
      600: '#000000',
      500: '#414141',
    },
    primary: '#f16471',
    secondary: '#e2e8f0',
    light: '#f7fafc',
    dark: '#10151f',
  },
  components: {
    Menu: menuTheme,
    Drawer: drawerTheme,
  },
});

export default theme;
