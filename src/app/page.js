'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  FaShoppingBag,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaChartLine,
  FaLightbulb,
  FaHandshake,
  FaClock,
  FaGlobe,
} from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();

  return (
    <PageWrapper>
      {/* ===== HERO SECTION ===== */}
      <HeroSection>
        <HeroContent>
          <HeroIcon>
            <FaShoppingBag />
          </HeroIcon>
          <HeroTitle>
            Your Campus Marketplace
          </HeroTitle>
          <HeroSubtitle>
            Connect, discover, and trade with verified students on your campus. Safe, fast, and trusted.
          </HeroSubtitle>
          <HeroStats>
            <StatItem>
              <StatNumber>1000+</StatNumber>
              <StatLabel>Verified Users</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>5000+</StatNumber>
              <StatLabel>Active Listings</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>10+</StatNumber>
              <StatLabel>Campuses</StatLabel>
            </StatItem>
          </HeroStats>
          <CTAButtons>
            <PrimaryButton onClick={() => router.push('/signup')}>
              Get Started Now
              <FaArrowRight />
            </PrimaryButton>
            <SecondaryButton onClick={() => router.push('/login')}>
              Sign In
            </SecondaryButton>
          </CTAButtons>
          <TrustBadges>
            <Badge>
              <FaShieldAlt /> University Verified
            </Badge>
            <Badge>
              <FaCheckCircle /> 100% Safe Trading
            </Badge>
          </TrustBadges>
        </HeroContent>
        <HeroVisual>
          <FloatingCard $delay="0s">
            <CardIcon>📱</CardIcon>
            <CardText>Browse Listings</CardText>
          </FloatingCard>
          <FloatingCard $delay="0.2s">
            <CardIcon>✨</CardIcon>
            <CardText>Connect Today</CardText>
          </FloatingCard>
          <FloatingCard $delay="0.4s">
            <CardIcon>🚀</CardIcon>
            <CardText>Start Trading</CardText>
          </FloatingCard>
        </HeroVisual>
      </HeroSection>

      {/* ===== VALUE PROPOSITION ===== */}
      <ValueSection>
        <SectionLabel>Why Choose Us?</SectionLabel>
        <SectionTitle>Built for Your Campus Community</SectionTitle>
        <ValueGrid>
          <ValueCard>
            <ValueIcon>
              <FaUsers />
            </ValueIcon>
            <ValueTitle>Verified Community</ValueTitle>
            <ValueText>
              Only verified university students. Built-in identity verification for safe trading.
            </ValueText>
            <ValueBadge>Trusted</ValueBadge>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FaRocket />
            </ValueIcon>
            <ValueTitle>Lightning Fast</ValueTitle>
            <ValueText>
              Quick responses, instant notifications. Get what you need in minutes, not days.
            </ValueText>
            <ValueBadge>Quick</ValueBadge>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FaShieldAlt />
            </ValueIcon>
            <ValueTitle>100% Safe</ValueTitle>
            <ValueText>
              Secure payments, buyer protection, and dispute resolution. Your safety is guaranteed.
            </ValueText>
            <ValueBadge>Secure</ValueBadge>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FaChartLine />
            </ValueIcon>
            <ValueTitle>Best Prices</ValueTitle>
            <ValueText>
              Compare prices instantly, negotiate directly. Save up to 40% on campus goods.
            </ValueText>
            <ValueBadge>Affordable</ValueBadge>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FaLightbulb />
            </ValueIcon>
            <ValueTitle>Smart Features</ValueTitle>
            <ValueText>
              Advanced filters, saved searches, and personalized recommendations just for you.
            </ValueText>
            <ValueBadge>Intelligent</ValueBadge>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FaHandshake />
            </ValueIcon>
            <ValueTitle>Direct Connection</ValueTitle>
            <ValueText>
              Chat instantly with sellers, ask questions, negotiate prices in real-time.
            </ValueText>
            <ValueBadge>Direct</ValueBadge>
          </ValueCard>
        </ValueGrid>
      </ValueSection>

      {/* ===== HOW IT WORKS ===== */}
      <HowItWorksSection>
        <SectionLabel>Getting Started</SectionLabel>
        <SectionTitle>Three Simple Steps</SectionTitle>
        <StepsContainer>
          <Step $stepNumber="1">
            <StepIcon>👤</StepIcon>
            <StepTitle>Create Account</StepTitle>
            <StepDescription>
              Sign up with your university email. We verify your identity in seconds.
            </StepDescription>
          </Step>

          <StepDivider />

          <Step $stepNumber="2">
            <StepIcon>🔍</StepIcon>
            <StepTitle>Browse & Search</StepTitle>
            <StepDescription>
              Explore thousands of listings from your campus. Filter by category, price, or location.
            </StepDescription>
          </Step>

          <StepDivider />

          <Step $stepNumber="3">
            <StepIcon>💬</StepIcon>
            <StepTitle>Connect & Trade</StepTitle>
            <StepDescription>
              Message sellers, negotiate prices, and complete your transaction safely.
            </StepDescription>
          </Step>
        </StepsContainer>
      </HowItWorksSection>

      {/* ===== FEATURES SHOWCASE ===== */}
      <FeaturesSection>
        <SectionLabel>Powerful Features</SectionLabel>
        <SectionTitle>Everything You Need</SectionTitle>
        <FeaturesGrid>
          <FeatureItem>
            <FeatureNumber>✓</FeatureNumber>
            <FeatureTitle>Real-Time Notifications</FeatureTitle>
            <FeatureDescription>Never miss a great deal or message</FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureNumber>✓</FeatureNumber>
            <FeatureTitle>Advanced Search</FeatureTitle>
            <FeatureDescription>Filter by price, category, condition, and more</FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureNumber>✓</FeatureNumber>
            <FeatureTitle>Saved Listings</FeatureTitle>
            <FeatureDescription>Bookmark items to view later</FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureNumber>✓</FeatureNumber>
            <FeatureTitle>User Reviews</FeatureTitle>
            <FeatureDescription>See seller ratings and buyer feedback</FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureNumber>✓</FeatureNumber>
            <FeatureTitle>Direct Messaging</FeatureTitle>
            <FeatureDescription>Chat securely with buyers and sellers</FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureNumber>✓</FeatureNumber>
            <FeatureTitle>Secure Transactions</FeatureTitle>
            <FeatureDescription>Protected payments and dispute resolution</FeatureDescription>
          </FeatureItem>
        </FeaturesGrid>
      </FeaturesSection>

      {/* ===== TESTIMONIALS ===== */}
      <TestimonialsSection>
        <SectionLabel>What Students Say</SectionLabel>
        <SectionTitle>Loved by Campus Communities</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i}>⭐</Star>
              ))}
            </Stars>
            <TestimonialText>
              "Found amazing deals for my dorm room. The platform is super easy to use and I felt safe trading with verified students."
            </TestimonialText>
            <TestimonialAuthor>Sarah M.</TestimonialAuthor>
            <TestimonialRole>Commerce Student</TestimonialRole>
          </TestimonialCard>

          <TestimonialCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i}>⭐</Star>
              ))}
            </Stars>
            <TestimonialText>
              "Sold my old textbooks in minutes. Great community and super responsive sellers. Love this app!"
            </TestimonialText>
            <TestimonialAuthor>James P.</TestimonialAuthor>
            <TestimonialRole>Engineering Student</TestimonialRole>
          </TestimonialCard>

          <TestimonialCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i}>⭐</Star>
              ))}
            </Stars>
            <TestimonialText>
              "Finally a marketplace where I can trust everyone. The verification system is brilliant and customer service is amazing."
            </TestimonialText>
            <TestimonialAuthor>Aisha K.</TestimonialAuthor>
            <TestimonialRole>Medical Student</TestimonialRole>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* ===== STATS SECTION ===== */}
      <StatsSection>
        <StatCard>
          <StatIcon>
            <FaUsers />
          </StatIcon>
          <StatValue>50K+</StatValue>
          <StatCaption>Active Users</StatCaption>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaShoppingBag />
          </StatIcon>
          <StatValue>250K+</StatValue>
          <StatCaption>Successful Trades</StatCaption>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaGlobe />
          </StatIcon>
          <StatValue>15+</StatValue>
          <StatCaption>Campuses</StatCaption>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaClock />
          </StatIcon>
          <StatValue>5 mins</StatValue>
          <StatCaption>Avg Response Time</StatCaption>
        </StatCard>
      </StatsSection>

      {/* ===== CTA FOOTER SECTION ===== */}
      <CTAFooterSection>
        <CTAFooterTitle>Ready to Join Your Campus Marketplace?</CTAFooterTitle>
        <CTAFooterSubtitle>
          Join thousands of verified students buying, selling, and trading safely on campus
        </CTAFooterSubtitle>
        <CTAFooterButtons>
          <PrimaryButton onClick={() => router.push('/signup')}>
            Create Free Account
            <FaArrowRight />
          </PrimaryButton>
          <SecondaryButton onClick={() => router.push('/login')}>
            Already a member? Sign in
          </SecondaryButton>
        </CTAFooterButtons>
      </CTAFooterSection>

      {/* ===== FOOTER ===== */}
      <FooterSection>
        <FooterContent>
          <FooterBrand>
            <FooterLogo>
              <FaShoppingBag />
            </FooterLogo>
            <FooterBrandName>Campus Marketplace</FooterBrandName>
          </FooterBrand>
          <FooterLinks>
            <FooterLink href="#about">About</FooterLink>
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            <FooterLink href="#contact">Contact Us</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            © 2026 Campus Marketplace. All rights reserved.
          </FooterCopyright>
        </FooterContent>
      </FooterSection>
    </PageWrapper>
  );
}

/* ===== STYLED COMPONENTS ===== */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #ffffff;
  overflow-x: hidden;
  font-family: 'Poppins', sans-serif;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
    gap: 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;

  @media (min-width: 768px) {
    gap: 28px;
  }

  @media (min-width: 1024px) {
    gap: 32px;
  }
`;

const HeroIcon = styled.div`
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (min-width: 768px) {
    font-size: 56px;
    width: 100px;
    height: 100px;
    border-radius: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 64px;
    width: 120px;
    height: 120px;
    border-radius: 24px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 44px;
  }

  @media (min-width: 1024px) {
    font-size: 56px;
  }

  @media (min-width: 1440px) {
    font-size: 64px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin: 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
    line-height: 1.8;
  }
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }

  @media (min-width: 1024px) {
    gap: 24px;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  @media (min-width: 768px) {
    padding: 14px 18px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 16px 20px;
    border-radius: 16px;
  }
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 4px;

  @media (min-width: 768px) {
    font-size: 24px;
    margin-bottom: 6px;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
    margin-bottom: 8px;
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: white;
  color: #1a1a1a;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
  font-family: 'Poppins', sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    padding: 16px 28px;
    font-size: 16px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 18px 32px;
    font-size: 17px;
    border-radius: 16px;
  }
`;

const SecondaryButton = styled.button`
  padding: 14px 24px;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    padding: 16px 28px;
    font-size: 16px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 18px 32px;
    font-size: 17px;
    border-radius: 16px;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 12px;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: fit-content;

  @media (min-width: 768px) {
    padding: 12px 18px;
    font-size: 13px;
    border-radius: 10px;
  }

  @media (min-width: 1024px) {
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 12px;
  }
`;

const HeroVisual = styled.div`
  display: none;
  position: relative;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const FloatingCard = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: floatCard 3s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay};

  @keyframes floatCard {
    0%, 100% { transform: translateY(0) rotateZ(0deg); }
    50% { transform: translateY(-15px) rotateZ(2deg); }
  }

  &:nth-child(1) {
    width: 100px;
    top: 20%;
    left: 10%;
  }

  &:nth-child(2) {
    width: 110px;
    top: 50%;
    right: 15%;
  }

  &:nth-child(3) {
    width: 100px;
    bottom: 20%;
    left: 20%;
  }

  @media (min-width: 1024px) {
    padding: 18px 24px;
    border-radius: 14px;

    &:nth-child(1) {
      width: 120px;
    }

    &:nth-child(2) {
      width: 130px;
    }

    &:nth-child(3) {
      width: 120px;
    }
  }
`;

const CardIcon = styled.div`
  font-size: 32px;

  @media (min-width: 1024px) {
    font-size: 40px;
  }
`;

const CardText = styled.p`
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  text-align: center;

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

const ValueSection = styled.section`
  padding: 40px 20px;
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);

  @media (min-width: 768px) {
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }
`;

const SectionLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 10px 0;

  @media (min-width: 768px) {
    font-size: 13px;
    margin-bottom: 12px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 14px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 32px 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 36px;
    margin-bottom: 40px;
  }

  @media (min-width: 1024px) {
    font-size: 44px;
    margin-bottom: 48px;
  }

  @media (min-width: 1440px) {
    font-size: 52px;
    margin-bottom: 56px;
  }
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (min-width: 1440px) {
    gap: 32px;
  }
`;

const ValueCard = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(26, 26, 26, 0.03) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: #1a1a1a;
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    padding: 28px;
    gap: 14px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    gap: 16px;
    border-radius: 16px;
  }
`;

const ValueIcon = styled.div`
  font-size: 32px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #f9f9f9;
  border-radius: 12px;

  @media (min-width: 768px) {
    font-size: 36px;
    width: 64px;
    height: 64px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 40px;
    width: 72px;
    height: 72px;
    border-radius: 16px;
  }
`;

const ValueTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 19px;
  }
`;

const ValueText = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
    line-height: 1.7;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const ValueBadge = styled.span`
  display: inline-block;
  background: #f0f0f0;
  color: #1a1a1a;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  width: fit-content;

  @media (min-width: 768px) {
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 8px;
  }
`;

const HowItWorksSection = styled.section`
  padding: 40px 20px;
  background: white;

  @media (min-width: 768px) {
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    align-items: start;
  }

  @media (min-width: 1024px) {
    gap: 40px;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

const StepIcon = styled.div`
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    font-size: 56px;
  }

  @media (min-width: 1024px) {
    font-size: 64px;
  }
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;

const StepDescription = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const StepDivider = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 24px;
    color: #f0f0f0;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

const FeaturesSection = styled.section`
  padding: 40px 20px;
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);

  @media (min-width: 768px) {
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (min-width: 1440px) {
    gap: 32px;
  }
`;

const FeatureItem = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1a1a1a;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  }

  @media (min-width: 768px) {
    padding: 24px;
    gap: 12px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
    gap: 14px;
    border-radius: 16px;
  }
`;

const FeatureNumber = styled.div`
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const FeatureTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

const FeatureDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

const TestimonialsSection = styled.section`
  padding: 40px 20px;
  background: white;

  @media (min-width: 768px) {
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (min-width: 1024px) {
    gap: 28px;
  }

  @media (min-width: 1440px) {
    gap: 32px;
  }
`;

const TestimonialCard = styled.div`
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
  border: 1px solid #f0f0f0;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1a1a1a;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 28px;
    gap: 14px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    gap: 16px;
    border-radius: 16px;
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
`;

const Star = styled.span`
  font-size: 16px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const TestimonialText = styled.p`
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin: 0;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 14px;
    line-height: 1.7;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const TestimonialAuthor = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 15px;
    margin-top: 6px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const TestimonialRole = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const StatsSection = styled.section`
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;

  @media (min-width: 768px) {
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }

  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  align-items: center;

  @media (min-width: 768px) {
    padding: 28px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    border-radius: 16px;
  }
`;

const StatIcon = styled.div`
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    font-size: 36px;
  }

  @media (min-width: 1024px) {
    font-size: 40px;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    font-size: 36px;
  }

  @media (min-width: 1440px) {
    font-size: 40px;
  }
`;

const StatCaption = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const CTAFooterSection = styled.section`
  padding: 40px 20px;
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
  text-align: center;

  @media (min-width: 768px) {
    padding: 60px 40px;
  }

  @media (min-width: 1024px) {
    padding: 80px 60px;
  }

  @media (min-width: 1440px) {
    padding: 100px 80px;
  }
`;

const CTAFooterTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 36px;
    margin-bottom: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 44px;
    margin-bottom: 20px;
  }

  @media (min-width: 1440px) {
    font-size: 52px;
  }
`;

const CTAFooterSubtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0 0 28px 0;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 17px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
    margin-bottom: 40px;
  }
`;

const CTAFooterButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 16px;
    justify-content: center;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

const FooterSection = styled.footer`
  padding: 32px 20px;
  background: #1a1a1a;
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    padding: 40px;
  }

  @media (min-width: 1024px) {
    padding: 48px 60px;
  }

  @media (min-width: 1440px) {
    padding: 56px 80px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    gap: 32px;
  }

  @media (min-width: 1024px) {
    gap: 40px;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const FooterLogo = styled.div`
  font-size: 28px;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const FooterBrandName = styled.p`
  font-size: 16px;
  font-weight: 700;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 17px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 768px) {
    gap: 24px;
    justify-content: flex-start;
  }

  @media (min-width: 1024px) {
    gap: 32px;
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: white;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const FooterCopyright = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;
