import React from 'react';
import styled, { keyframes } from 'styled-components';

type SpinnerSize = 'small' | 'medium' | 'large';

interface SpinnerProps {
  size?: SpinnerSize;
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

const getSpinnerSize = (size: SpinnerSize) => {
  const sizes = {
    small: '1rem',
    medium: '2rem',
    large: '3rem',
  };

  return sizes[size];
};

const SpinnerContainer = styled.div<{ size: SpinnerSize; color: string }>`
  display: inline-block;
  width: ${({ size }) => getSpinnerSize(size)};
  height: ${({ size }) => getSpinnerSize(size)};
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  border-top-color: ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color,
  className,
}) => {
  return <SpinnerContainer size={size} color={color} className={className} />;
};

export default Spinner; 