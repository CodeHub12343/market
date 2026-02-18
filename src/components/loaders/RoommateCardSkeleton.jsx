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
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  height: 16px;
  width: 85%;
  margin-bottom: 6px;
`;

const SkeletonLocation = styled(SkeletonLine)`
  height: 12px;
  width: 70%;
  margin-bottom: 4px;
`;

const SkeletonDescription = styled(SkeletonLine)`
  height: 12px;
  width: 100%;
  margin-bottom: 4px;

  &:last-of-type {
    width: 80%;
  }
`;

const SkeletonFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
`;

const SkeletonPrice = styled(SkeletonLine)`
  height: 16px;
  width: 50%;
`;

const SkeletonButton = styled(SkeletonLine)`
  height: 32px;
  width: 40px;
  border-radius: 8px;
`;

export default function RoommateCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <ContentWrapper>
        <SkeletonTitle />
        <SkeletonLocation />
        <SkeletonDescription />
        <SkeletonDescription />
        <SkeletonFooter>
          <SkeletonPrice />
          <SkeletonButton />
        </SkeletonFooter>
      </ContentWrapper>
    </SkeletonCard>
  );
}
