import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'outlined':
      return css`
        border: 1px solid ${({ theme }) => theme.colors.gray200};
        background-color: transparent;
      `;
    case 'elevated':
      return css`
        background-color: white;
        box-shadow: ${({ theme }) => theme.shadows.md};
      `;
    default:
      return css`
        background-color: white;
        border: none;
      `;
  }
};

const getPaddingStyles = (padding: string) => {
  switch (padding) {
    case 'none':
      return css`
        padding: 0;
      `;
    case 'small':
      return css`
        padding: ${({ theme }) => theme.space.sm};
      `;
    case 'large':
      return css`
        padding: ${({ theme }) => theme.space.lg};
      `;
    default:
      return css`
        padding: ${({ theme }) => theme.space.md};
      `;
  }
};

const StyledCard = styled.div<{
  variant: string;
  padding: string;
  fullWidth?: boolean;
  clickable?: boolean;
}>`
  border-radius: ${({ theme }) => theme.radii.lg};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  transition: all 0.2s;

  ${({ variant }) => getVariantStyles(variant)}
  ${({ padding }) => getPaddingStyles(padding)}

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
      }
      &:active {
        transform: translateY(0);
      }
    `}
`;

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'medium',
  fullWidth = false,
  children,
  onClick,
  className,
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      fullWidth={fullWidth}
      clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

export default Card; 