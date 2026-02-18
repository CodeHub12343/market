'use client';

import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 1024px) {
    gap: 24px;
  }
`;

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 0;

  @media (min-width: 768px) {
    border-radius: 12px;
    margin-bottom: 24px;
  }
`;

const TitleSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 1024px) {
    padding: 20px 24px;
    margin: 0;
  }
`;

const SkeletonBadge = styled.div`
  height: 24px;
  width: 100px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const SkeletonTitle = styled.div`
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 90%;
`;

const SkeletonPrice = styled.div`
  height: 28px;
  width: 180px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const QuickStatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const SkeletonStatCard = styled.div`
  background: #f9f9f9;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const SkeletonStatIcon = styled.div`
  height: 20px;
  width: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin: 0 auto;
`;

const SkeletonStatValue = styled.div`
  height: 16px;
  width: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin: 0 auto;
`;

const SkeletonStatLabel = styled.div`
  height: 10px;
  width: 50px;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin: 0 auto;
`;

const DescriptionSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const SkeletonText = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
  width: ${props => props.$width || '100%'};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonSectionTitle = styled.div`
  height: 20px;
  width: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SkeletonInfoCard = styled.div`
  padding: 12px;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const SkeletonLabel = styled.div`
  height: 12px;
  width: 60%;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
`;

const SkeletonValue = styled.div`
  height: 16px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
`;

const AmenitiesSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
`;

const SkeletonAmenity = styled.div`
  height: 44px;
  background: linear-gradient(90deg, #f0f9ff 25%, #e0f2fe 50%, #f0f9ff 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 10px;
  border: 1px solid #e0f2fe;
`;

const OwnerSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const SkeletonOwnerCard = styled.div`
  background: linear-gradient(135deg, #f9f9f9 0%, #f3f4f6 100%);
  border: 1px solid #f0f0f0;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 20px;
    gap: 16px;
  }
`;

const SkeletonAvatar = styled.div`
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;

  @media (min-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

const SkeletonOwnerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonOwnerName = styled.div`
  height: 16px;
  width: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
`;

const SkeletonOwnerType = styled.div`
  height: 12px;
  width: 80px;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
`;

const ActionButtonsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SkeletonButton = styled.div`
  height: 44px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
`;

export default function HostelDetailSkeleton() {
  return (
    <SkeletonWrapper>
      <SkeletonImage />

      <TitleSection>
        <SkeletonBadge />
        <SkeletonTitle />
        <SkeletonPrice />
      </TitleSection>

      <QuickStatsSection>
        {[...Array(4)].map((_, i) => (
          <SkeletonStatCard key={i}>
            <SkeletonStatIcon />
            <SkeletonStatValue />
            <SkeletonStatLabel />
          </SkeletonStatCard>
        ))}
      </QuickStatsSection>

      <InfoGrid>
        {[...Array(4)].map((_, i) => (
          <SkeletonInfoCard key={i}>
            <SkeletonLabel />
            <SkeletonValue />
          </SkeletonInfoCard>
        ))}
      </InfoGrid>

      <DescriptionSection>
        <SkeletonSectionTitle />
        <SkeletonText />
        <SkeletonText $width="95%" />
        <SkeletonText $width="85%" />
      </DescriptionSection>

      <AmenitiesSection>
        <SkeletonSectionTitle />
        <AmenitiesGrid>
          {[...Array(6)].map((_, i) => (
            <SkeletonAmenity key={i} />
          ))}
        </AmenitiesGrid>
      </AmenitiesSection>

      <OwnerSection>
        <SkeletonSectionTitle />
        <SkeletonOwnerCard>
          <SkeletonAvatar />
          <SkeletonOwnerInfo>
            <SkeletonOwnerName />
            <SkeletonOwnerType />
            <SkeletonOwnerType />
          </SkeletonOwnerInfo>
        </SkeletonOwnerCard>
      </OwnerSection>

      <ActionButtonsSection>
        {[...Array(2)].map((_, i) => (
          <SkeletonButton key={i} />
        ))}
      </ActionButtonsSection>
    </SkeletonWrapper>
  );
}