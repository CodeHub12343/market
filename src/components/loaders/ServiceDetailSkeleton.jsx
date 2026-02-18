import styled from 'styled-components';

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
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;

  @media (min-width: 768px) {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
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
  width: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 6px;
  margin-bottom: 12px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonTitle = styled.div`
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 90%;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonPrice = styled.div`
  height: 28px;
  width: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 12px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
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
  animation: shimmerSlow 2s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
  width: ${props => props.$width || '100%'};

  &:last-child {
    margin-bottom: 0;
  }

  @keyframes shimmerSlow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonSectionTitle = styled.div`
  height: 20px;
  width: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 12px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
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
`;

const SkeletonLabel = styled.div`
  height: 12px;
  width: 60%;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: shimmerSlow 2s infinite;
  border-radius: 4px;

  @keyframes shimmerSlow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonValue = styled.div`
  height: 16px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const ProviderSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const SkeletonProviderCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const SkeletonAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  flex-shrink: 0;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const ActionButtonsSection = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const SkeletonButton = styled.div`
  flex: 1;
  height: 44px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function ServiceDetailSkeleton() {
  return (
    <SkeletonWrapper>
      <SkeletonImage />

      <TitleSection>
        <SkeletonBadge />
        <SkeletonTitle />
        <SkeletonPrice />
      </TitleSection>

      <DescriptionSection>
        <SkeletonSectionTitle />
        <SkeletonText />
        <SkeletonText $width="95%" />
        <SkeletonText $width="85%" />
      </DescriptionSection>

      <InfoGrid>
        {[...Array(4)].map((_, i) => (
          <SkeletonInfoCard key={i}>
            <SkeletonLabel />
            <SkeletonValue />
          </SkeletonInfoCard>
        ))}
      </InfoGrid>

      <ProviderSection>
        <SkeletonSectionTitle />
        <SkeletonProviderCard>
          <SkeletonAvatar />
          <div style={{ flex: 1 }}>
            <SkeletonText $width="70%" />
            <SkeletonText $width="50%" />
          </div>
        </SkeletonProviderCard>
      </ProviderSection>

      <ActionButtonsSection>
        <SkeletonButton />
        <SkeletonButton />
      </ActionButtonsSection>

      <DescriptionSection>
        <SkeletonSectionTitle />
        <SkeletonText />
        <SkeletonText $width="95%" />
        <SkeletonText $width="80%" />
      </DescriptionSection>
    </SkeletonWrapper>
  );
}
