import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    color: ${({ theme }) => theme.colors.gray900};
    background-color: ${({ theme }) => theme.colors.light};
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    color: ${({ theme }) => theme.colors.gray900};
    margin-bottom: ${({ theme }) => theme.space.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['4xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }

  p {
    margin-bottom: ${({ theme }) => theme.space.md};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  /* Form elements */
  input,
  textarea,
  select,
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }

  /* Lists */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: ${({ theme }) => theme.space.sm};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
    border-radius: ${({ theme }) => theme.radii.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray400};
    border-radius: ${({ theme }) => theme.radii.full};

    &:hover {
      background: ${({ theme }) => theme.colors.gray500};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default GlobalStyles; 