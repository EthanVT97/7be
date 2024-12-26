import styled from 'styled-components';
import LoadingSpinner from '../common/LoadingSpinner';

export const ModalOverlay = styled.div`
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
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #6c757d;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'success' }>`
  padding: 0.75rem 1rem;
  background-color: ${props => {
    switch (props.variant) {
      case 'danger':
        return '#dc3545';
      case 'success':
        return '#28a745';
      default:
        return '#007bff';
    }
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => {
      switch (props.variant) {
        case 'danger':
          return '#c82333';
        case 'success':
          return '#218838';
        default:
          return '#0056b3';
      }
    }};
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export const Title = styled.h2`
  margin: 0 0 1.5rem;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #343a40;
  }
`;

export const InfoText = styled.p`
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  text-align: center;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #dee2e6;
  margin: 1.5rem 0;
`; 