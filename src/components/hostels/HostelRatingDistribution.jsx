'use client';

import styled from 'styled-components';
import { Star } from 'lucide-react';
import { useHostelRatingStats } from '@/hooks/useHostelReviews';

const Container = styled.div`
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const AverageSection = styled.div`
  text-align: center;
`;

const AverageRating = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
`;

const AverageLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
  margin: 6px 0;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const TotalCount = styled.div`
  font-size: 13px;
  color: #999;
`;

const Divider = styled.div`
  width: 1px;
  height: 60px;
  background: #f0f0f0;
`;

const Distribution = styled.div`
  flex: 1;
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StarLabel = styled.div`
  width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 8px;
  background: #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  background: #ffc107;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$percentage}%;
`;

const CountLabel = styled.div`
  width: 40px;
  text-align: left;
  font-size: 12px;
  color: #999;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
`;

export default function HostelRatingDistribution({ hostelId }) {
  const { data: stats, isLoading } = useHostelRatingStats(hostelId);

  if (isLoading) {
    return (
      <Container>
        <EmptyState>Loading rating statistics...</EmptyState>
      </Container>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <Container>
        <EmptyState>No ratings yet. Be the first to review this hostel!</EmptyState>
      </Container>
    );
  }

  const distribution = stats.distribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  const totalReviews = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <Container>
      <Header>
        <AverageSection>
          <AverageRating>
            {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
          </AverageRating>
          <Stars>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                fill={i < Math.round(stats.averageRating || 0) ? '#ffc107' : '#f0f0f0'}
              />
            ))}
          </Stars>
          <TotalCount>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</TotalCount>
          <AverageLabel>Average Rating</AverageLabel>
        </AverageSection>

        <Divider />

        <Distribution>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = distribution[rating] || 0;
            const percentage = getPercentage(count);

            return (
              <DistributionRow key={rating}>
                <StarLabel>{rating}★</StarLabel>
                <BarContainer>
                  <Bar $percentage={percentage} />
                </BarContainer>
                <CountLabel>{count}</CountLabel>
              </DistributionRow>
            );
          })}
        </Distribution>
      </Header>
    </Container>
  );
}
