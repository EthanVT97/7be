import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Padauk:wght@400;700&display=swap');

  html {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.gradients.background};
    min-height: 100vh;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 { font-size: ${({ theme }) => theme.typography.fontSize['4xl']}; }
  h2 { font-size: ${({ theme }) => theme.typography.fontSize['3xl']}; }
  h3 { font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; }
  h4 { font-size: ${({ theme }) => theme.typography.fontSize.xl}; }
  h5 { font-size: ${({ theme }) => theme.typography.fontSize.lg}; }
  h6 { font-size: ${({ theme }) => theme.typography.fontSize.base}; }

  a {
    color: ${({ theme }) => theme.colors.text.primary};
    text-decoration: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
      text-shadow: ${({ theme }) => theme.shadows.glow};
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: ${({ theme }) => theme.colors.text.dark};
    background-color: ${({ theme }) => theme.colors.background.light};
    border: 1px solid transparent;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: ${({ theme }) => theme.shadows.glow};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
      opacity: 0.7;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.dark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.full};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  /* Glass effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }

  /* Utility classes */
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-left { text-align: left; }

  .mt-1 { margin-top: ${({ theme }) => theme.spacing.sm}; }
  .mt-2 { margin-top: ${({ theme }) => theme.spacing.md}; }
  .mt-3 { margin-top: ${({ theme }) => theme.spacing.lg}; }
  .mt-4 { margin-top: ${({ theme }) => theme.spacing.xl}; }

  .mb-1 { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .mb-2 { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .mb-3 { margin-bottom: ${({ theme }) => theme.spacing.lg}; }
  .mb-4 { margin-bottom: ${({ theme }) => theme.spacing.xl}; }

  .p-1 { padding: ${({ theme }) => theme.spacing.sm}; }
  .p-2 { padding: ${({ theme }) => theme.spacing.md}; }
  .p-3 { padding: ${({ theme }) => theme.spacing.lg}; }
  .p-4 { padding: ${({ theme }) => theme.spacing.xl}; }
`; 