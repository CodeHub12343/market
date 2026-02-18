'use client';

import styled from 'styled-components';
import { ChevronRight, Sparkles } from 'lucide-react';
import { usePersonalizedServiceRecommendations } from '@/hooks/useServiceRecommendations';
import ServiceCard from './ServiceCard';

const Section = styled.div`
  margin-bottom: 32px;

  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0;
    margin-bottom: 24px;
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const SparklesIcon = styled(Sparkles)`
  width: 20px;
  height: 20px;
  color: #6366f1;
`;

const ViewAllLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    gap: 8px;
    
    svg {
      transform: translateX(2px);
    }
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 0;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    overflow: visible;
  }
`;

const CardWrapper = styled.div`
  flex: 0 0 calc(100vw - 48px);
  min-width: 0;

  @media (min-width: 640px) {
    flex: 0 0 calc(50vw - 20px);
  }

  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 11px);
  }

  @media (min-width: 1024px) {
    flex: none;
  }
`;

const SkeletonCard = styled.div`
  flex: 0 0 calc(100vw - 48px);
  min-width: 0;
  height: 280px;
  background: #f0f0f0;
  border-radius: 12px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @media (min-width: 640px) {
    flex: 0 0 calc(50vw - 20px);
  }

  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 11px);
  }

  @media (min-width: 1024px) {
    flex: none;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: #e0e7ff;
  color: #6366f1;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default function PersonalizedServiceRecommendations({
  enabled = true,
  onNavigateToService = null
}) {
  const { data = {}, isLoading } = usePersonalizedServiceRecommendations(enabled);
  const services = data.recommendations || data.services || [];

  if (!enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitleWrapper>
            <SparklesIcon />
            <SectionTitle>Recommended For You</SectionTitle>
          </SectionTitleWrapper>
        </SectionHeader>
        <ScrollContainer>
          {[...Array(4)].map((_, i) => (
            <CardWrapper key={i}>
              <SkeletonCard />
            </CardWrapper>
          ))}
        </ScrollContainer>
      </Section>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitleWrapper>
          <SparklesIcon />
          <SectionTitle>Recommended For You</SectionTitle>
          {services.length > 0 && <Badge>Personalized</Badge>}
        </SectionTitleWrapper>
        {services.length > 3 && (
          <ViewAllLink>
            View All <ChevronRight />
          </ViewAllLink>
        )}
      </SectionHeader>

      <ScrollContainer>
        {services.map((service) => (
          <CardWrapper key={service._id}>
            <ServiceCard
              service={service}
              onClick={() => onNavigateToService?.(service._id)}
            />
          </CardWrapper>
        ))}
      </ScrollContainer>
    </Section>
  );
}
