import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { routes } from '../routes/routes';
import Button from '../components/common/Button';

const HeroSection = styled.section`
  padding: ${({ theme }) => theme.space['3xl']} 0;
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primaryDark} 100%
  );
  color: ${({ theme }) => theme.colors.white};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['5xl']};
  margin-bottom: ${({ theme }) => theme.space.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes['4xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  justify-content: center;
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.space['3xl']} 0;
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.xl};
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.md};
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
`;

const Home: React.FC = () => {
  return (
    <>
      <HeroSection>
        <HeroTitle>Welcome to 2D3D Lottery</HeroTitle>
        <HeroSubtitle>
          Experience the thrill of winning with our secure and fair lottery platform
        </HeroSubtitle>
        <ButtonGroup>
          <Button as={Link} to={routes.register.path} size="large">
            Get Started
          </Button>
          <Button
            as={Link}
            to={routes.login.path}
            variant="outline"
            size="large"
          >
            Sign In
          </Button>
        </ButtonGroup>
      </HeroSection>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Easy to Play</FeatureTitle>
            <FeatureDescription>
              Simple and intuitive interface for placing bets and managing your
              account
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure Platform</FeatureTitle>
            <FeatureDescription>
              Advanced security measures to protect your data and transactions
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Quick Payouts</FeatureTitle>
            <FeatureDescription>
              Fast and reliable payment processing for your winnings
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </>
  );
};

export default Home; 