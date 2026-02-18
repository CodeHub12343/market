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
  animation: ${shimmer} 2s infinite;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
`;

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #e8e8e8;
  animation: ${shimmer} 2s infinite;
  background: linear-gradient(
    90deg,
    #e8e8e8 0%,
    #d8d8d8 50%,
    #e8e8e8 100%
  );
  background-size: 1000px 100%;
`;

const SkeletonInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonLine = styled.div`
  height: ${props => props.height || '12px'};
  background: #f0f0f0;
  border-radius: 4px;
  animation: ${shimmer} 2s infinite;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  width: ${props => props.width || '100%'};
`;

const SkeletonName = styled(SkeletonLine)`
  height: 14px;
  margin-bottom: 6px;
`;

const SkeletonPrice = styled(SkeletonLine)`
  height: 16px;
  width: 70%;
  margin-top: 4px;
`;

export default function ProductCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <SkeletonInfo>
        <SkeletonName />
        <SkeletonLine height="10px" width="85%" />
        <SkeletonPrice />
      </SkeletonInfo>
    </SkeletonCard>
  );
}
