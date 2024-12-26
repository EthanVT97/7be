import React from 'react';
import styled from 'styled-components';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorContainer = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;

  &::before {
    content: '⚠️';
    margin-right: 0.5rem;
  }
`;

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;
  
  return (
    <ErrorContainer className={className}>
      {message}
    </ErrorContainer>
  );
};

export default ErrorMessage; 