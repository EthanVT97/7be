import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../routes/routes';
import Button from '../components/common/Button';

const Container = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.md};
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.space.xl};
  max-width: 500px;
`;

const NotFound: React.FC = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Description>
      <Button as={Link} to={routes.home.path} size="large">
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound; 