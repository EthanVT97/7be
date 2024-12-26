import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: string; isClosing?: boolean }>`
  position: fixed;
  top: ${({ theme }) => theme.space.lg};
  right: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.info;
    }
  }};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  z-index: 1100;
  animation: ${({ isClosing }) => isClosing ? slideOut : slideIn} 0.3s ease-in-out;
`;

const Icon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  cursor: pointer;
  padding: 0;
  margin-left: ${({ theme }) => theme.space.md};
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <ToastContainer type={type}>
      <Icon>{getIcon()}</Icon>
      <Message>{message}</Message>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ToastContainer>
  );
};

export default Toast; 