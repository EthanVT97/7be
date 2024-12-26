import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
}

const CheckboxWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const CheckboxContainer = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const getCheckboxSize = (size: string) => {
  switch (size) {
    case 'small':
      return '1rem';
    case 'large':
      return '1.5rem';
    default:
      return '1.25rem';
  }
};

const StyledCheckbox = styled.div<{
  checked?: boolean;
  hasError?: boolean;
  size: string;
}>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => getCheckboxSize(size)};
  height: ${({ size }) => getCheckboxSize(size)};
  background: ${({ checked, theme }) =>
    checked ? theme.colors.primary : 'white'};
  border: 2px solid
    ${({ checked, hasError, theme }) =>
      hasError
        ? theme.colors.danger
        : checked
        ? theme.colors.primary
        : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s;

  ${({ checked }) =>
    checked &&
    css`
      &::after {
        content: '';
        width: 30%;
        height: 60%;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) translate(-10%, -10%);
      }
    `}

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  ${({ hasError, theme }) =>
    hasError &&
    css`
      ${HiddenCheckbox}:focus + & {
        box-shadow: 0 0 0 2px ${theme.colors.danger}20;
      }
    `}
`;

const Label = styled.span<{ size: string }>`
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme.fontSizes.sm;
      case 'large':
        return theme.fontSizes.lg;
      default:
        return theme.fontSizes.md;
    }
  }};
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, size = 'medium', className, ...props }, ref) => {
    return (
      <CheckboxWrapper className={className}>
        <CheckboxContainer disabled={props.disabled}>
          <HiddenCheckbox ref={ref} {...props} />
          <StyledCheckbox
            checked={props.checked}
            hasError={!!error}
            size={size}
          />
          {label && <Label size={size}>{label}</Label>}
        </CheckboxContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </CheckboxWrapper>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 