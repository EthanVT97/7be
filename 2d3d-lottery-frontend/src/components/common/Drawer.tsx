import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { createPortal } from 'react-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  title?: string;
  children: React.ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndices.modal};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const DrawerContainer = styled.div<{ isOpen: boolean; position: 'left' | 'right' }>`
  position: fixed;
  top: 0;
  ${({ position }) => position}: 0;
  bottom: 0;
  width: 300px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndices.modal};
  transform: translateX(${({ isOpen, position }) => (isOpen ? '0' : position === 'left' ? '-100%' : '100%')});
  transition: transform ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DrawerTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray900};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.space.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  line-height: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const DrawerContent = styled.div`
  padding: ${({ theme }) => theme.space.md};
  flex: 1;
  overflow-y: auto;
`;

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return createPortal(
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <DrawerContainer isOpen={isOpen} position={position}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </DrawerHeader>
        <DrawerContent>{children}</DrawerContent>
      </DrawerContainer>
    </Overlay>,
    document.body
  );
};

export default Drawer; 