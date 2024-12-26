import React from 'react';
import styled, { css } from 'styled-components';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
  outlined?: boolean;
  children: React.ReactNode;
  className?: string;
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${({ theme }) => `${theme.space.xxs} ${theme.space.xs}`};
        font-size: ${({ theme }) => theme.fontSizes.xs};
      `;
    case 'large':
      return css`
        padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
        font-size: ${({ theme }) => theme.fontSizes.md};
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      `;
  }
};

const getVariantStyles = (variant: string, outlined: boolean) => {
  const variants = {
    primary: css`
      background-color: ${({ theme }) => outlined ? 'transparent' : theme.colors.primary};
      color: ${({ theme }) => outlined ? theme.colors.primary : 'white'};
      border: 1px solid ${({ theme }) => theme.colors.primary};
    `,
    secondary: css`
      background-color: ${({ theme }) => outlined ? 'transparent' : theme.colors.secondary};
      color: ${({ theme }) => outlined ? theme.colors.secondary : 'white'};
      border: 1px solid ${({ theme }) => theme.colors.secondary};
    `,
    success: css`
      background-color: ${({ theme }) => outlined ? 'transparent' : theme.colors.success};
      color: ${({ theme }) => outlined ? theme.colors.success : 'white'};
      border: 1px solid ${({ theme }) => theme.colors.success};
    `,
    danger: css`
      background-color: ${({ theme }) => outlined ? 'transparent' : theme.colors.danger};
      color: ${({ theme }) => outlined ? theme.colors.danger : 'white'};
      border: 1px solid ${({ theme }) => theme.colors.danger};
    `,
    warning: css`
      background-color: ${({ theme }) => outlined ? 'transparent' : theme.colors.warning};
      color: ${({ theme }) => outlined ? theme.colors.warning : 'white'};
      border: 1px solid ${({ theme }) => theme.colors.warning};
    `,
    info: css`
      background-color: ${({ theme }) => outlined ? 'transparent' : theme.colors.info};
      color: ${({ theme }) => outlined ? theme.colors.info : 'white'};
      border: 1px solid ${({ theme }) => theme.colors.info};
    `,
  };

  return variants[variant] || variants.primary;
};

const StyledBadge = styled.span<{
  variant: string;
  size: string;
  rounded: boolean;
  outlined: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  border-radius: ${({ rounded, theme }) =>
    rounded ? theme.radii.full : theme.radii.sm};
  transition: all 0.2s;

  ${({ size }) => getSizeStyles(size)}
  ${({ variant, outlined }) => getVariantStyles(variant, outlined)}
`;

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  rounded = false,
  outlined = false,
  children,
  className,
}) => {
  return (
    <StyledBadge
      variant={variant}
      size={size}
      rounded={rounded}
      outlined={outlined}
      className={className}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge; 