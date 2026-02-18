'use client';

import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useRelatedHostels } from '@/hooks/useHostelRecommendations';
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

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const Badge = styled.span`
  background: #f0f9ff;
  color: #0369a1;
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

export default function RelatedHostels({ hostelId, hostelType, currentHostelId }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const { data = [], isLoading, error } = useRelatedHostels(
    hostelId || currentHostelId,
    !!hostelId || !!currentHostelId
  );

  // Filter out current hostel
  const filteredData = data.filter(h => h._id !== currentHostelId);

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

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Related Hostels</Title>
          <Badge>6</Badge>
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
          <Title>Related Hostels</Title>
        </Header>
        <ErrorState>Failed to load related hostels. Please try again later.</ErrorState>
      </Container>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Related Hostels</Title>
        </Header>
        <EmptyState>
          <p>No related hostels found</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Related Hostels</Title>
        <Badge>{filteredData.length}</Badge>
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
          {filteredData.map(hostel => (
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
