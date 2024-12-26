import React from 'react';
import styled, { css } from 'styled-components';

type ErrorMessageVariant = 'error' | 'warning' | 'info' | 'success';

interface ErrorMessageProps {
  variant?: ErrorMessageVariant;
  message: string;
  className?: string;
}

const getVariantStyles = (variant: ErrorMessageVariant, theme: any) => {
  const styles = {
    error: css`
      background-color: ${theme.colors.dangerLight};
      color: ${theme.colors.danger};
      border-color: ${theme.colors.danger};
    `,
    warning: css`
      background-color: ${theme.colors.warningLight};
      color: ${theme.colors.warning};
      border-color: ${theme.colors.warning};
    `,
    info: css`
      background-color: ${theme.colors.infoLight};
      color: ${theme.colors.info};
      border-color: ${theme.colors.info};
    `,
    success: css`
      background-color: ${theme.colors.successLight};
      color: ${theme.colors.success};
      border-color: ${theme.colors.success};
    `,
  };

  return styles[variant];
};

const Container = styled.div<{ variant: ErrorMessageVariant }>`
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};

  ${({ variant, theme }) => getVariantStyles(variant, theme)}
`;

const Icon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const getIcon = (variant: ErrorMessageVariant) => {
  const icons = {
    error: '⚠️',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
  };

  return icons[variant];
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  variant = 'error',
  message,
  className,
}) => {
  return (
    <Container variant={variant} className={className}>
      <Icon>{getIcon(variant)}</Icon>
      {message}
    </Container>
  );
};

export default ErrorMessage; 