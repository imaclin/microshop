import { lightColors, darkColors, liquidGlassColors, gradients } from './colors';
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
import { spacing, borderRadius, shadows } from './spacing';
import { Theme, LiquidGlassTheme } from '../types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  typography: {
    fontFamily: {
      primary: fontFamily.primary!,
      secondary: fontFamily.secondary!,
      mono: fontFamily.mono!,
    },
    fontSize,
    fontWeight: {
      light: fontWeight.light,
      normal: fontWeight.normal,
      medium: fontWeight.medium,
      bold: fontWeight.bold,
    },
  },
  spacing,
  borderRadius,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  typography: {
    fontFamily: {
      primary: fontFamily.primary!,
      secondary: fontFamily.secondary!,
      mono: fontFamily.mono!,
    },
    fontSize,
    fontWeight: {
      light: fontWeight.light,
      normal: fontWeight.normal,
      medium: fontWeight.medium,
      bold: fontWeight.bold,
    },
  },
  spacing,
  borderRadius,
};

export const defaultLiquidGlassTheme: LiquidGlassTheme = {
  glass: {
    blur: 15,
    transparency: 0.2,
    borderOpacity: 0.3,
    shadowOpacity: 0.4,
  },
  colors: liquidGlassColors,
  animations: {
    shimmer: true,
    ripple: true,
    morphing: true,
    fluid: true,
  },
};

export { lightColors, darkColors, liquidGlassColors, gradients };
export { fontFamily, fontSize, fontWeight, lineHeight };
export { spacing, borderRadius, shadows };
