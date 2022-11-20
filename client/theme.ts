// theme.ts
// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
// 3. extend the theme
const theme = extendTheme({
  config,
  colors: {
    cyan: {
      50: '#F0F0F5',
      100: '#D4D6E3',
      200: '#B8BCD1',
      300: '#9CA2BE',
      400: '#8188AC',
      500: '#656E9A',
      600: '#51587B',
      700: '#3D425C',
      800: '#282C3E',
      900: '#14161F',
    },
  },
})
export default theme
