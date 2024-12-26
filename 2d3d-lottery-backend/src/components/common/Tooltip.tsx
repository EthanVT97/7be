import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const getPositionStyles = (position: string) => {
  const positions = {
    top: css`
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: ${({ theme }) => theme.space.xs};

      &::after {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-color: ${({ theme }) => theme.colors.dark} transparent transparent;
      }
    `,
    right: css`
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      margin-left: ${({ theme }) => theme.space.xs};

      &::after {
        top: 50%;
        right: 100%;
        transform: translateY(-50%);
        border-color: transparent ${({ theme }) => theme.colors.dark} transparent
          transparent;
      }
    `,
    bottom: css`
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: ${({ theme }) => theme.space.xs};

      &::after {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-color: transparent transparent ${({ theme }) => theme.colors.dark};
      }
    `,
    left: css`
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      margin-right: ${({ theme }) => theme.space.xs};

      &::after {
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        border-color: transparent transparent transparent
          ${({ theme }) => theme.colors.dark};
      }
    `,
  };

  return positions[position] || positions.top;
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ position: string; show: boolean }>`
  position: absolute;
  z-index: 1000;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  background-color: ${({ theme }) => theme.colors.dark};
  color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
  pointer-events: none;
  animation: ${fadeIn} 0.2s ease-in-out;
  opacity: ${({ show }) => (show ? 1 : 0)};

  &::after {
    content: '';
    position: absolute;
    border-style: solid;
    border-width: 6px;
  }

  ${({ position }) => getPositionStyles(position)}
`;

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 200,
  children,
  className,
}) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShow(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipContainer
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <TooltipContent position={position} show={show}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip; 