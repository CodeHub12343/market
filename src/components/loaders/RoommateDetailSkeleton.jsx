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
  gap: 24px;
`;

const HeaderBar = styled.div`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 24px;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SkeletonButton = styled.div`
  width: 100px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 6px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 32px;
`;

const SkeletonTitle = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 60%;
`;

const SkeletonLocation = styled.div`
  height: 18px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  width: 40%;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 12px;
`;

const SkeletonCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SkeletonCardTitle = styled.div`
  height: 20px;
  width: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SkeletonText = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
  width: ${props => props.$width || '100%'};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const SkeletonActionButton = styled.div`
  flex: 1;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkeletonPriceCard = styled(SkeletonCard)`
  text-align: center;
`;

const SkeletonPrice = styled.div`
  height: 32px;
  width: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  margin: 0 auto 12px;
`;

export default function RoommateDetailSkeleton() {
  return (
    <>
      <HeaderBar>
        <HeaderContent>
          <SkeletonButton />
          <div style={{ display: 'flex', gap: '8px' }}>
            <SkeletonButton style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <SkeletonButton style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <SkeletonButton style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          </div>
        </HeaderContent>
      </HeaderBar>

      <ContentWrapper>
        <TitleSection>
          <SkeletonTitle />
          <SkeletonLocation />
        </TitleSection>

        <MainGrid>
          <LeftSection>
            <SkeletonImage />
            
            <SkeletonCard>
              <SkeletonCardTitle />
              <SkeletonText $width="100%" />
              <SkeletonText $width="95%" />
              <SkeletonText $width="90%" />
              <SkeletonButtonGroup>
                <SkeletonActionButton />
                <SkeletonActionButton />
              </SkeletonButtonGroup>
            </SkeletonCard>
          </LeftSection>

          <RightSection>
            <SkeletonCard>
              <SkeletonCardTitle />
              <SkeletonText $width="50%" style={{ margin: '0 auto 12px' }} />
              <SkeletonText $width="70%" style={{ margin: '0 auto' }} />
            </SkeletonCard>

            <SkeletonPriceCard>
              <SkeletonCardTitle />
              <SkeletonPrice />
              <SkeletonText $width="60%" style={{ margin: '0 auto' }} />
            </SkeletonPriceCard>

            <SkeletonCard>
              <SkeletonCardTitle />
              <SkeletonButtonGroup>
                <SkeletonActionButton />
                <SkeletonActionButton />
              </SkeletonButtonGroup>
            </SkeletonCard>
          </RightSection>
        </MainGrid>
      </ContentWrapper>
    </>
  );
}
