import React from 'react';
import styled from 'styled-components';

const HomeWrapper = styled.div`
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.xl};
  margin-bottom: ${({ theme }) => theme.space['2xl']};
`;

const Feature = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const CTASection = styled.section`
  text-align: center;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space['2xl']} 0;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const CTAButton = styled.button`
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Home: React.FC = () => {
  return (
    <HomeWrapper>
      <div className="container">
        <Hero>
          <Title>Welcome to 2D3D Lottery</Title>
          <Subtitle>Your trusted platform for secure and exciting lottery games</Subtitle>
        </Hero>

        <Features>
          <Feature>
            <FeatureTitle>2D Lottery</FeatureTitle>
            <p>Play our popular 2D lottery game with draws twice daily</p>
          </Feature>

          <Feature>
            <FeatureTitle>3D Lottery</FeatureTitle>
            <p>Try your luck with our 3D lottery, drawn every week</p>
          </Feature>

          <Feature>
            <FeatureTitle>Secure Platform</FeatureTitle>
            <p>Play with confidence on our secure and reliable platform</p>
          </Feature>
        </Features>

        <CTASection>
          <Title style={{ color: 'white' }}>Ready to Try Your Luck?</Title>
          <Subtitle style={{ color: 'white' }}>Join thousands of winners today!</Subtitle>
          <CTAButton>Start Playing Now</CTAButton>
        </CTASection>
      </div>
    </HomeWrapper>
  );
};

export default Home; 