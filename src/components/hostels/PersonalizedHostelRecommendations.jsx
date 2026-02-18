'use client';

import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { usePersonalizedRecommendations } from '@/hooks/useHostelRecommendations';
import { useAuth } from '@/hooks/useAuth';
import HostelCard from './HostelCard';

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const SparkleIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  animation: sparkle 1.5s ease-in-out infinite;

  svg {
    width: 18px;
    height: 18px;
  }

  @keyframes sparkle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }
`;

const Badge = styled.span`
  background: #f3e8ff;
  color: #6b21a8;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselWrapper = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const CardWrapper = styled.div`
  flex: 0 0 calc(50% - 6px);
  min-width: 160px;
  max-width: 100%;

  @media (min-width: 640px) {
    flex: 0 0 calc(33.333% - 11px);
    min-width: 200px;
  }

  @media (min-width: 768px) {
    flex: 0 0 calc(25% - 12px);
    min-width: 220px;
  }

  @media (min-width: 1024px) {
    flex: 0 0 calc(20% - 13px);
    min-width: 200px;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  opacity: 0;

  svg {
    width: 18px;
    height: 18px;
    color: #1a1a1a;
  }

  &:hover {
    background: #f9f9f9;
    border-color: #1a1a1a;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  ${ScrollContainer}:hover & {
    opacity: 1;
  }

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const LeftButton = styled(ScrollButton)`
  left: 8px;
`;

const RightButton = styled(ScrollButton)`
  right: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const SkeletonCard = styled.div`
  flex: 0 0 calc(50% - 6px);
  min-width: 160px;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 640px) {
    flex: 0 0 calc(33.333% - 11px);
    min-width: 200px;
  }

  @media (min-width: 768px) {
    flex: 0 0 calc(25% - 12px);
    min-width: 220px;
  }

  @media (min-width: 1024px) {
    flex: 0 0 calc(20% - 13px);
    min-width: 200px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const ErrorState = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 16px;
  color: #991b1b;
  font-size: 14px;
  text-align: center;
`;

const LoginPrompt = styled.div`
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  text-align: center;

  p {
    margin: 0 0 12px 0;
    color: #0369a1;
    font-size: 14px;
  }
`;

const LoginButton = styled.a`
  display: inline-block;
  background: #1a1a1a;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #000;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 26, 26, 0.2);
  }
`;

export default function PersonalizedHostelRecommendations() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);
  const { user } = useAuth();

  // Only fetch if user is logged in
  const { data = [], isLoading, error } = usePersonalizedRecommendations(!!user);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Don't show if user is not logged in
  if (!user) {
    return (
      <Container>
        <Header>
          <TitleWrapper>
            <SparkleIcon>
              <Sparkles />
            </SparkleIcon>
            <Title>For You</Title>
          </TitleWrapper>
        </Header>
        <LoginPrompt>
          <p>Sign in to see personalized hostel recommendations based on your preferences</p>
          <LoginButton href="/auth/signin">Sign In</LoginButton>
        </LoginPrompt>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Header>
          <TitleWrapper>
            <SparkleIcon>
              <Sparkles />
            </SparkleIcon>
            <Title>Recommended For You</Title>
          </TitleWrapper>
          <Badge>Personalized</Badge>
        </Header>
        <LoadingContainer>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <TitleWrapper>
            <SparkleIcon>
              <Sparkles />
            </SparkleIcon>
            <Title>Recommended For You</Title>
          </TitleWrapper>
        </Header>
        <ErrorState>Failed to load recommendations. Please try again later.</ErrorState>
      </Container>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Container>
        <Header>
          <TitleWrapper>
            <SparkleIcon>
              <Sparkles />
            </SparkleIcon>
            <Title>Recommended For You</Title>
          </TitleWrapper>
        </Header>
        <EmptyState>
          <p>No recommendations available yet. Check back soon!</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <SparkleIcon>
            <Sparkles />
          </SparkleIcon>
          <Title>Recommended For You</Title>
        </TitleWrapper>
        <Badge>Personalized</Badge>
      </Header>

      <ScrollContainer
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseEnter={handleScroll}
      >
        <LeftButton
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </LeftButton>

        <CarouselWrapper>
          {data.map(hostel => (
            <CardWrapper key={hostel._id}>
              <HostelCard
                hostel={hostel}
                compact={true}
              />
            </CardWrapper>
          ))}
        </CarouselWrapper>

        <RightButton
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight />
        </RightButton>
      </ScrollContainer>
    </Container>
  );
}
