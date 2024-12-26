import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
}

const RadioWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const RadioContainer = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const getRadioSize = (size: string) => {
  switch (size) {
    case 'small':
      return '1rem';
    case 'large':
      return '1.5rem';
    default:
      return '1.25rem';
  }
};

const StyledRadio = styled.div<{
  checked?: boolean;
  hasError?: boolean;
  size: string;
}>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => getRadioSize(size)};
  height: ${({ size }) => getRadioSize(size)};
  background: white;
  border: 2px solid
    ${({ checked, hasError, theme }) =>
      hasError
        ? theme.colors.danger
        : checked
        ? theme.colors.primary
        : theme.colors.gray300};
  border-radius: 50%;
  transition: all 0.2s;

  ${({ checked, theme }) =>
    checked &&
    css`
      &::after {
        content: '';
        width: 60%;
        height: 60%;
        background-color: ${theme.colors.primary};
        border-radius: 50%;
      }
    `}

  ${HiddenRadio}:focus + & {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  ${({ hasError, theme }) =>
    hasError &&
    css`
      ${HiddenRadio}:focus + & {
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

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, size = 'medium', className, ...props }, ref) => {
    return (
      <RadioWrapper className={className}>
        <RadioContainer disabled={props.disabled}>
          <HiddenRadio ref={ref} {...props} />
          <StyledRadio
            checked={props.checked}
            hasError={!!error}
            size={size}
          />
          {label && <Label size={size}>{label}</Label>}
        </RadioContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </RadioWrapper>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio; 