import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.space.xl};
  max-width: 600px;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
  }
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundWrapper>
      <Title>404 - Page Not Found</Title>
      <Message>
        Sorry, the page you are looking for might have been removed or is temporarily unavailable.
      </Message>
      <HomeLink to="/">Return to Home</HomeLink>
    </NotFoundWrapper>
  );
};

export default NotFound; 