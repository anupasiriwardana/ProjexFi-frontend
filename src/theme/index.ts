import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#E3FFF3',
      100: '#B3FAD9',
      200: '#80F4BE',
      300: '#4EEEA3',
      400: '#1CE889',
      500: '#03CE70',
      600: '#009F58',
      700: '#007140',
      800: '#004329',
      900: '#00170F',
    },
    surface: {
      900: '#0B0B0B',
      800: '#121212',
      700: '#1A1A1A',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'surface.900',
        color: 'gray.100',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
      },
      variants: {
        solid: {
          bg: 'brand.400',
          color: 'black',
          _hover: { bg: 'brand.300' },
          _active: { bg: 'brand.500' },
        },
      },
    },
  },
})
