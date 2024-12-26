import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.space.lg} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
`;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.light};
  text-decoration: none;
  display: block;
  margin-bottom: ${({ theme }) => theme.space.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space.lg};
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <FooterTitle>About Us</FooterTitle>
            <p>Your trusted platform for 2D and 3D lottery games. Play responsibly and securely.</p>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/results">Results</FooterLink>
            <FooterLink href="/how-to-play">How to Play</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact Us</FooterTitle>
            <p>Email: support@2d3dlottery.com</p>
            <p>Phone: +95 123 456 789</p>
            <p>Available: 24/7</p>
          </FooterSection>
        </FooterContent>

        <Copyright>
          <p>&copy; {currentYear} 2D3D Lottery. All rights reserved.</p>
        </Copyright>
      </div>
    </FooterWrapper>
  );
};

export default Footer; 