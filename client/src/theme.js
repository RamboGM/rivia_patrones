import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#f7f3f8',
        color: '#111',
      },
    },
  },
  colors: {
    brand: {
      50: '#ffe5f3',
      100: '#ffb8de',
      200: '#ff8bc9',
      300: '#ff5eb4',
      400: '#ff32a0',
      500: '#ff068b',
      600: '#d60070',
      700: '#ad0056',
      800: '#85003c',
      900: '#5c0023',
    },
  },
  fonts: {
    heading: `'Poppins', system-ui, sans-serif`,
    body: `'Inter', system-ui, sans-serif`,
  },
});

export default theme;
