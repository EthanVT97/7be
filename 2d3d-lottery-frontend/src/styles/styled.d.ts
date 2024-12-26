import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      // Brand colors
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      secondaryLight: string;
      secondaryDark: string;

      // Status colors
      success: string;
      successLight: string;
      danger: string;
      dangerLight: string;
      warning: string;
      warningLight: string;
      info: string;
      infoLight: string;

      // Grayscale
      white: string;
      gray50: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      black: string;

      // Background
      light: string;
      dark: string;
    };

    typography: {
      fontFamily: {
        body: string;
        heading: string;
        mono: string;
      };
      fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
      };
      fontWeights: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeights: {
        none: number;
        tight: number;
        snug: number;
        normal: number;
        relaxed: number;
        loose: number;
      };
      letterSpacings: {
        tighter: string;
        tight: string;
        normal: string;
        wide: string;
        wider: string;
        widest: string;
      };
    };

    space: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };

    radii: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };

    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      inner: string;
      none: string;
    };

    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };

    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };

    zIndices: {
      hide: number;
      auto: string;
      base: number;
      docked: number;
      dropdown: number;
      sticky: number;
      banner: number;
      overlay: number;
      modal: number;
      popover: number;
      skipLink: number;
      toast: number;
      tooltip: number;
    };
  }
} 