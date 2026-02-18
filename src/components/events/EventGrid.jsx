'use client';

import styled from 'styled-components';
import EventCard from './EventCard';
import { EventGridSkeleton } from '@/components/common/SkeletonLoaders';
import { Calendar } from 'lucide-react';

const GridWrapper = styled.div`
  width: 100%;
  padding: 24px 16px;

  @media (min-width: 768px) {
    padding: 32px 24px;
  }

  @media (min-width: 1024px) {
    padding: 40px 32px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
  }

  @media (min-width: 1920px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin: 40px 0;

  @media (max-width: 640px) {
    padding: 60px 24px;
    margin: 24px 0;
  }
`;

const EmptyIcon = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  svg {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 640px) {
    width: 80px;
    height: 80px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const EmptyTitle = styled.h3`
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const LoadingContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
  gap: 24px;

  @media (max-width: 640px) {
    padding: 24px 16px;
  }
`;

export default function EventGrid({
  events = [],
  isLoading = false,
  onSearchChange,
  onCategoryChange,
  searchTerm = '',
  category = 'all'
}) {
  if (isLoading) {
    return (
      <GridWrapper>
        <EventGridSkeleton count={6} />
      </GridWrapper>
    );
  }

  return (
    <GridWrapper>
      {events.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Calendar />
          </EmptyIcon>
          <EmptyTitle>No events found</EmptyTitle>
          <EmptyText>
            {searchTerm ? 'Try adjusting your search terms or filters' : 'Check back soon for upcoming events in your campus'}
          </EmptyText>
        </EmptyState>
      ) : (
        <GridContainer>
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </GridContainer>
      )}
    </GridWrapper>
  );
}
