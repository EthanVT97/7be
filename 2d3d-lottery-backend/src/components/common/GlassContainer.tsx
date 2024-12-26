import styled, { css } from 'styled-components';

interface GlassContainerProps {
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const getPaddingStyles = (padding: GlassContainerProps['padding'] = 'md') => {
  switch (padding) {
    case 'sm':
      return css`padding: ${({ theme }) => theme.spacing.md};`;
    case 'lg':
      return css`padding: ${({ theme }) => theme.spacing.xl};`;
    default:
      return css`padding: ${({ theme }) => theme.spacing.lg};`;
  }
};

const getVariantStyles = (variant: GlassContainerProps['variant'] = 'primary') => {
  switch (variant) {
    case 'secondary':
      return css`
        background: rgba(231, 127, 175, 0.1); // Soft Dark Gold with opacity
        border: 1px solid rgba(231, 127, 175, 0.2);
      `;
    default:
      return css`
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      `;
  }
};

export const GlassContainer = styled.div<GlassContainerProps>`
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  ${({ padding }) => getPaddingStyles(padding)}
  ${({ variant }) => getVariantStyles(variant)}
  
  /* Subtle shadow for depth */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Hover effect */
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

// Variants for different sections
export const LoginContainer = styled(GlassContainer)`
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
`;

export const DashboardContainer = styled(GlassContainer)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const BettingContainer = styled(GlassContainer)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const WalletContainer = styled(GlassContainer)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`; 