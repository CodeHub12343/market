'use client';

import styled, { keyframes } from 'styled-components';

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    #e8e8e8 0%,
    #d8d8d8 50%,
    #e8e8e8 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
`;

const ContentWrapper = styled.div`
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const SkeletonLine = styled.div`
  height: ${props => props.height || '12px'};
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  width: ${props => props.width || '100%'};
  border-radius: 4px;
`;

const SkeletonTitle = styled(SkeletonLine)`
  height: 14px;
  width: 85%;
  margin-bottom: 6px;
`;

const SkeletonLocation = styled(SkeletonLine)`
  height: 11px;
  width: 70%;
  margin-bottom: 6px;
`;

const SkeletonDescription = styled(SkeletonLine)`
  height: 10px;
  width: 90%;
  margin-bottom: 8px;
`;

const PriceRatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
`;

const SkeletonPrice = styled(SkeletonLine)`
  height: 16px;
  width: 60%;
`;

const SkeletonRating = styled(SkeletonLine)`
  height: 14px;
  width: 45px;
`;

const SkeletonBadge = styled(SkeletonLine)`
  height: 20px;
  width: 50px;
`;

const AmenitiesRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;

const SkeletonAmenity = styled(SkeletonLine)`
  height: 20px;
  width: 50px;
  flex-shrink: 0;
`;

export default function HostelCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <ContentWrapper>
        <HeaderRow>
          <TitleSection>
            <SkeletonTitle />
            <SkeletonLocation />
          </TitleSection>
          <SkeletonBadge />
        </HeaderRow>
        
        <SkeletonDescription />
        
        <PriceRatingRow>
          <SkeletonPrice />
          <SkeletonRating />
        </PriceRatingRow>
        
        <AmenitiesRow>
          <SkeletonAmenity />
          <SkeletonAmenity />
          <SkeletonAmenity />
        </AmenitiesRow>
      </ContentWrapper>
    </SkeletonCard>
  );
}
