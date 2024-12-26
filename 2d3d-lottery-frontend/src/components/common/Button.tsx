import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getButtonStyles = (variant: ButtonVariant, theme: any) => {
  const styles = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
      border: 1px solid ${theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
        border-color: ${theme.colors.primaryDark};
      }
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.white};
      border: 1px solid ${theme.colors.secondary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondaryDark};
        border-color: ${theme.colors.secondaryDark};
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryLight};
      }
    `,
    ghost: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid transparent;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryLight};
      }
    `,
    danger: css`
      background-color: ${theme.colors.danger};
      color: ${theme.colors.white};
      border: 1px solid ${theme.colors.danger};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.dangerDark};
        border-color: ${theme.colors.dangerDark};
      }
    `,
  };

  return styles[variant];
};

const getButtonSize = (size: ButtonSize, theme: any) => {
  const sizes = {
    small: css`
      padding: ${theme.space.xs} ${theme.space.sm};
      font-size: ${theme.typography.fontSizes.sm};
    `,
    medium: css`
      padding: ${theme.space.sm} ${theme.space.md};
      font-size: ${theme.typography.fontSizes.md};
    `,
    large: css`
      padding: ${theme.space.md} ${theme.space.lg};
      font-size: ${theme.typography.fontSizes.lg};
    `,
  };

  return sizes[size];
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};

  ${({ variant = 'primary', theme }) => getButtonStyles(variant, theme)}
  ${({ size = 'medium', theme }) => getButtonSize(size, theme)}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      position: relative;
      cursor: wait;

      & > * {
        opacity: 0;
      }

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

const Button: React.FC<ButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <StyledButton {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </StyledButton>
  );
};

export default Button; 