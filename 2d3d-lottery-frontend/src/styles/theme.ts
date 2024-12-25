export const theme = {
  colors: {
    // Primary Colors
    primary: '#FF4C8B',      // Vibrant Pink
    secondary: '#E77FAF',    // Soft Dark Gold
    accent: '#FFD8A8',       // Light Orange
    
    // Background Colors
    background: {
      primary: '#004D40',    // Dark Green
      secondary: '#E77FAF',  // Soft Dark Gold
      gradient: {
        start: '#004D40',    // Dark Green
        middle: '#E77FAF',   // Soft Dark Gold
        end: '#FFD8A8',      // Light Orange
      },
      dark: '#001F1A',       // Darker Green
      light: '#FFFFFF',      // White
    },
    
    // Text Colors
    text: {
      primary: '#FFFFFF',    // White
      secondary: '#FFD8A8',  // Light Orange
      dark: '#001F1A',       // Darker Green
    },
    
    // Status Colors
    success: '#4CAF50',      // Green
    warning: '#FFC107',      // Amber
    error: '#FF5252',        // Red
    info: '#2196F3',         // Blue
    
    // Betting Colors
    win: '#4CAF50',          // Green
    lose: '#FF5252',         // Red
    pending: '#FFC107',      // Amber
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: '"Inter", "Padauk", sans-serif',
      heading: '"Poppins", "Padauk", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px',   // Circle
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    glow: '0 0 15px rgba(255, 76, 139, 0.5)', // Pink glow
  },
  
  // Transitions
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Z-index
  zIndex: {
    modal: 1000,
    dropdown: 100,
    header: 50,
  },

  // Gradients
  gradients: {
    background: `linear-gradient(180deg, 
      #004D40 0%,      /* Dark Green */
      #E77FAF 50%,     /* Soft Dark Gold */
      #FFD8A8 100%     /* Light Orange */
    )`,
    button: `linear-gradient(45deg,
      #FF4C8B 0%,      /* Vibrant Pink */
      #E77FAF 100%     /* Soft Dark Gold */
    )`,
  }
};

export type Theme = typeof theme; 