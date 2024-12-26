import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface DropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  className?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownContainer = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
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

const DropdownButton = styled.button<{
  isOpen: boolean;
  hasError?: boolean;
  size: string;
  variant: string;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  ${({ size }) => getSizeStyles(size)}

  ${({ variant, theme }) =>
    variant === 'filled'
      ? css`
          border: none;
          background-color: ${theme.colors.gray100};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray200};
          }
        `
      : css`
          border: 1px solid ${theme.colors.gray300};
          background-color: white;
          &:hover:not(:disabled) {
            border-color: ${theme.colors.primary};
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

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const DropdownIcon = styled.span<{ isOpen: boolean }>`
  margin-left: ${({ theme }) => theme.space.sm};
  transition: transform 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownList = styled.ul<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: ${({ theme }) => theme.space.xs} 0;
  padding: ${({ theme }) => theme.space.xs} 0;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 1000;
  list-style: none;
  max-height: 250px;
  overflow-y: auto;
  animation: ${fadeIn} 0.2s ease-in-out;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.li<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const ItemIcon = styled.span`
  margin-right: ${({ theme }) => theme.space.sm};
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  fullWidth = false,
  size = 'medium',
  variant = 'outlined',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled && onChange) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <DropdownContainer ref={containerRef} fullWidth={fullWidth} className={className}>
      <DropdownButton
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        isOpen={isOpen}
        hasError={!!error}
        size={size}
        variant={variant}
        disabled={disabled}
      >
        <span>
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <ItemIcon>{selectedOption.icon}</ItemIcon>
              )}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <DropdownIcon isOpen={isOpen}>▼</DropdownIcon>
      </DropdownButton>

      <DropdownList isOpen={isOpen}>
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelect(option)}
            disabled={option.disabled}
          >
            {option.icon && <ItemIcon>{option.icon}</ItemIcon>}
            {option.label}
          </DropdownItem>
        ))}
      </DropdownList>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </DropdownContainer>
  );
};

export default Dropdown; 