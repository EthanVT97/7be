import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
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

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.gray};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled.input<{
  hasIcon?: boolean;
  hasError?: boolean;
  variant?: string;
}>`
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  padding-left: ${({ hasIcon, theme }) =>
    hasIcon ? `calc(${theme.space.sm} * 2 + 1em)` : theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.2s;

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

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = false, variant = 'outlined', ...props }, ref) => {
    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputContainer>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            ref={ref}
            hasIcon={!!icon}
            hasError={!!error}
            variant={variant}
            {...props}
          />
        </InputContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input; 