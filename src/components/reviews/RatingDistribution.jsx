'use client';

import styled from 'styled-components';
import { Star } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RatingOverview = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 640px) {
    gap: 12px;
  }
`;

const AverageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 80px;
`;

const AverageRating = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fbbf24;
`;

const TotalReviews = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const DistributionSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarLabel = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 500;
  min-width: 50px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Bar = styled.div`
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  max-width: 200px;
`;

const Fill = styled.div`
  height: 100%;
  background: #fbbf24;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const Count = styled.div`
  font-size: 12px;
  color: #999;
  min-width: 35px;
  text-align: right;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
`;

export default function RatingDistribution({ stats }) {
  if (!stats) {
    return (
      <NoReviews>
        No ratings yet. Be the first to rate this product.
      </NoReviews>
    );
  }

  const {
    averageRating = 0,
    totalReviews = 0,
    distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  } = stats;

  const renderStars = (rating) => {
    return (
      <RatingStars>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < rating ? '#fbbf24' : 'none'}
            color={i < rating ? '#fbbf24' : '#e5e5e5'}
          />
        ))}
      </RatingStars>
    );
  };

  return (
    <Container>
      <RatingOverview>
        <AverageSection>
          <AverageRating>{averageRating.toFixed(1)}</AverageRating>
          {renderStars(Math.round(averageRating))}
          <TotalReviews>{totalReviews} reviews</TotalReviews>
        </AverageSection>

        <DistributionSection>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <DistributionRow key={rating}>
                <StarLabel>
                  {rating}
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                </StarLabel>
                <Bar>
                  <Fill style={{ width: `${percentage}%` }} />
                </Bar>
                <Count>{count}</Count>
              </DistributionRow>
            );
          })}
        </DistributionSection>
      </RatingOverview>
    </Container>
  );
}
