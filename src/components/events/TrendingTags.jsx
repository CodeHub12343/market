'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { TrendingUp, Users } from 'lucide-react';
import { useTrendingTags } from '@/hooks/useCategoryTag';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  svg {
    width: 20px;
    height: 20px;
    color: #f59e0b;
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
`;

const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
`;

const TagCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    background: #f3f4f6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const TagName = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #4f46e5;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const TagStats = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const RankBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`;

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
`;

const SkeletonCard = styled.div`
  height: 100px;
  background: #e5e7eb;
  border-radius: 8px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;

  @media (min-width: 768px) {
    padding: 48px 24px;
    font-size: 15px;
  }
`;

const TrendingTags = ({ limit = 10 }) => {
  const { data: tags = [], isLoading } = useTrendingTags(limit);

  if (isLoading) {
    return (
      <Container>
        <Header>
          <TrendingUp />
          <h2>Trending Tags</h2>
        </Header>
        <LoadingContainer>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </LoadingContainer>
      </Container>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <Container>
        <Header>
          <TrendingUp />
          <h2>Trending Tags</h2>
        </Header>
        <EmptyState>
          No trending tags at the moment. Create some events with tags to get started!
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TrendingUp />
        <h2>Trending Tags</h2>
      </Header>

      <TagsGrid>
        {tags.map((tag, index) => (
          <TagCard
            key={tag._id || tag.id}
            href={`/events?tag=${encodeURIComponent(tag.name || tag)}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RankBadge>{index + 1}</RankBadge>
              <TagName>
                #{tag.name || tag}
              </TagName>
            </div>
            <TagStats>
              <Users />
              <span>
                {tag.eventCount || tag.count || 0} events
              </span>
            </TagStats>
          </TagCard>
        ))}
      </TagsGrid>
    </Container>
  );
};

export default TrendingTags;
