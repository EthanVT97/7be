import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ModalAnimationProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Content = styled.div`
  animation: ${slideIn} 0.3s ease-out;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

export const ModalAnimation: React.FC<ModalAnimationProps> = ({
  children,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Content onClick={e => e.stopPropagation()}>
        {children}
      </Content>
    </Overlay>
  );
};

export default ModalAnimation; 