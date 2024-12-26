import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ size: number }>`
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  text-align: center;
`;

const Spinner = styled.div<{ size: number; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: ${props => Math.max(2, props.size / 8)}px solid ${props => props.color};
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = '#007bff',
  className,
}) => {
  return (
    <SpinnerContainer size={size} className={className}>
      <Spinner size={size} color={color} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 