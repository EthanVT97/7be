import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const Main = styled.main`
  margin-top: 80px; // Header height + spacing
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Main>
        <Container>
          {children}
        </Container>
      </Main>
    </>
  );
};

export default Layout; 