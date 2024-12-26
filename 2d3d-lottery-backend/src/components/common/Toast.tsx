import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: ToastType; isClosing?: boolean }>`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return '#d4edda';
      case 'error':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      default:
        return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return '#155724';
      case 'error':
        return '#721c24';
      case 'warning':
        return '#856404';
      default:
        return '#0c5460';
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  z-index: 2000;
  animation: ${props =>
    props.isClosing
      ? css`${slideOut} 0.3s ease-in-out forwards`
      : css`${slideIn} 0.3s ease-in-out`};
`;

const Icon = styled.span`
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    default:
      return 'ℹ';
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer type={type}>
      <Icon>{getIcon(type)}</Icon>
      {message}
      <CloseButton onClick={onClose} aria-label="Close notification">
        ×
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast; 