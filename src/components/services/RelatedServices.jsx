'use client';

import styled from 'styled-components';
import { ChevronRight, Star, MapPin, Heart } from 'lucide-react';
import { useRelatedServices, useServicesByCategory } from '@/hooks/useServiceRecommendations';
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

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
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

const EmptyState = styled.div`
  padding: 40px 16px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;

  p {
    font-size: 14px;
    color: #999;
    margin: 0;
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

export default function RelatedServices({
  serviceId,
  categoryId,
  onNavigateToService = null
}) {
  // Try to fetch related services first
  const {
    data: relatedData = {},
    isLoading: relatedLoading,
    error: relatedError
  } = useRelatedServices(serviceId);

  const relatedServices = relatedData.related || relatedData.services || [];

  // Fallback: fetch services from same category
  const shouldFallback = !relatedLoading && (!relatedServices || relatedServices.length === 0);
  const {
    data: categoryData = {},
    isLoading: categoryLoading
  } = useServicesByCategory(categoryId, serviceId, shouldFallback);

  const categoryServices = categoryData.services || [];
  const displayServices = relatedServices.length > 0 ? relatedServices : categoryServices;
  const isLoading = relatedLoading || (shouldFallback && categoryLoading);

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Related Services</SectionTitle>
        </SectionHeader>
        <ScrollContainer>
          {[...Array(3)].map((_, i) => (
            <CardWrapper key={i}>
              <SkeletonCard />
            </CardWrapper>
          ))}
        </ScrollContainer>
      </Section>
    );
  }

  if (!displayServices || displayServices.length === 0) {
    return null; // Don't show section if no related services
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Related Services</SectionTitle>
        {displayServices.length > 3 && (
          <ViewAllLink>
            View All <ChevronRight />
          </ViewAllLink>
        )}
      </SectionHeader>

      <ScrollContainer>
        {displayServices.map((service) => (
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
