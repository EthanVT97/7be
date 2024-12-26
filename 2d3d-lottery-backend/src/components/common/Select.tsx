import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: Option[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
}

const SelectWrapper = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
`;

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      `;
    case 'large':
      return css`
        padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
        font-size: ${({ theme }) => theme.fontSizes.lg};
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
        font-size: ${({ theme }) => theme.fontSizes.md};
      `;
  }
};

const StyledSelect = styled.select<{
  hasError?: boolean;
  size: string;
  variant?: string;
}>`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right ${({ theme }) => theme.space.sm} center;
  background-repeat: no-repeat;
  background-size: 1.5em;
  padding-right: 2.5em;

  ${({ size }) => getSizeStyles(size)}

  ${({ variant }) =>
    variant === 'filled'
      ? css`
          border: none;
          background-color: ${({ theme }) => theme.colors.gray100};
          &:focus {
            background-color: ${({ theme }) => theme.colors.gray200};
            outline: none;
          }
        `
      : css`
          border: 1px solid ${({ theme }) => theme.colors.gray300};
          background-color: white;
          &:focus {
            border-color: ${({ theme }) => theme.colors.primary};
            box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
            outline: none;
          }
        `}

  ${({ hasError, theme }) =>
    hasError &&
    css`
      border-color: ${theme.colors.danger};
      &:focus {
        border-color: ${theme.colors.danger};
        box-shadow: 0 0 0 2px ${theme.colors.danger}20;
      }
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      fullWidth = false,
      size = 'medium',
      variant = 'outlined',
      ...props
    },
    ref
  ) => {
    return (
      <SelectWrapper fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <StyledSelect
          ref={ref}
          hasError={!!error}
          size={size}
          variant={variant}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SelectWrapper>
    );
  }
);

Select.displayName = 'Select';

export default Select; 