import { extendTheme } from '@chakra-ui/react';
import '@fontsource/open-sans/800.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/400.css';

const theme = extendTheme({
	fonts: {
		body: `'Open Sans', sans-serif`,
		heading: `'Open Sans', sans-serif`,
	},
	colors: {
		blackButton: {
			700: '#252929',
			600: '#000000',
			500: '#252929',
		},
	},
});

export default theme;
