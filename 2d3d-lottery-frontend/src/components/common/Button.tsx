import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.text.primary};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.secondary};
          box-shadow: ${({ theme }) => theme.shadows.glow};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.text.primary};
        &:hover:not(:disabled) {
          opacity: 0.9;
          box-shadow: ${({ theme }) => theme.shadows.glow};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        border: 2px solid ${({ theme }) => theme.colors.text.primary};
        color: ${({ theme }) => theme.colors.text.primary};
        &:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: ${({ theme }) => theme.colors.primary};
          color: ${({ theme }) => theme.colors.primary};
          box-shadow: ${({ theme }) => theme.shadows.glow};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.text.primary};
        &:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1);
          color: ${({ theme }) => theme.colors.primary};
          box-shadow: ${({ theme }) => theme.shadows.glow};
        }
      `;
    case 'gradient':
      return css`
        background: ${({ theme }) => theme.gradients.button};
        color: ${({ theme }) => theme.colors.text.primary};
        &:hover:not(:disabled) {
          opacity: 0.9;
          box-shadow: ${({ theme }) => theme.shadows.glow};
          transform: translateY(-1px);
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
      `;
    case 'md':
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        font-size: ${({ theme }) => theme.typography.fontSize.base};
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
      `;
  }
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border: none;
  cursor: pointer;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'md' }) => getSizeStyles(size)}
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      position: relative;
      cursor: wait;
      
      &::after {
        content: '';
        position: absolute;
        width: 1em;
        height: 1em;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`; 