import React from 'react';
import { ModalContent, Title, CloseButton, LoadingOverlay, StyledLoadingSpinner } from './styles';
import ErrorMessage from '../common/ErrorMessage';
import ModalAnimation from '../common/ModalAnimation';
import styled from 'styled-components';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  error?: string;
  isLoading?: boolean;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const StyledModalContent = styled(ModalContent)<{ maxWidth: string }>`
  max-width: ${props => props.maxWidth};
  position: relative;
  margin: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  error,
  isLoading,
  maxWidth = '400px',
  showCloseButton = true
}) => {
  return (
    <ModalAnimation isOpen={isOpen} onClose={onClose}>
      <StyledModalContent 
        maxWidth={maxWidth}
      >
        {showCloseButton && (
          <CloseButton onClick={onClose} aria-label="Close modal">
            ×
          </CloseButton>
        )}
        <Title>{title}</Title>
        
        {error && <ErrorMessage message={error} />}
        
        {children}
        
        {isLoading && (
          <LoadingOverlay>
            <StyledLoadingSpinner size={32} />
          </LoadingOverlay>
        )}
      </StyledModalContent>
    </ModalAnimation>
  );
};

export default ModalWrapper; 