'use client';

import styled from 'styled-components';
import { Star } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`;

const TopSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const AverageRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e5e5;
  }
`;

const RatingNumber = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
`;

const StarRow = styled.div`
  display: flex;
  gap: 4px;

  svg {
    width: 16px;
    height: 16px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: #999;
`;

const DistributionChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 4px;
  }
`;

const RatingLabel = styled.span`
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
  flex-shrink: 0;

  @media (max-width: 640px) {
    min-width: 30px;
    font-size: 11px;
  }
`;

const BarContainer = styled.div`
  flex: 1;
  height: 24px;
  background: #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ffc107 0%, #ff9800 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  font-size: 11px;
  color: white;
  font-weight: 600;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
`;

export default function ServiceRatingDistribution({ stats }) {
  if (!stats || stats.totalReviews === 0) {
    return (
      <Container>
        <NoReviews>No reviews yet. Be the first to share your experience!</NoReviews>
      </Container>
    );
  }

  const distribution = stats.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const maxCount = Math.max(...Object.values(distribution));

  return (
    <Container>
      <TopSection>
        <AverageRating>
          <RatingNumber>{stats.averageRating?.toFixed(1) || '0'}</RatingNumber>
          <StarRow>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                fill={i < Math.round(stats.averageRating) ? '#ffc107' : '#e5e5e5'}
                color={i < Math.round(stats.averageRating) ? '#ffc107' : '#e5e5e5'}
              />
            ))}
          </StarRow>
          <ReviewCount>
            {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </ReviewCount>
        </AverageRating>

        <DistributionChart>
          {[5, 4, 3, 2, 1].map((rating) => (
            <DistributionRow key={rating}>
              <RatingLabel>{rating}★</RatingLabel>
              <BarContainer>
                {distribution[rating] > 0 && (
                  <BarFill
                    style={{
                      width: `${(distribution[rating] / maxCount) * 100}%`,
                    }}
                  >
                    {distribution[rating]}
                  </BarFill>
                )}
              </BarContainer>
            </DistributionRow>
          ))}
        </DistributionChart>
      </TopSection>
    </Container>
  );
}
