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

const SkeletonBase = styled.div`
  animation: ${shimmer} 2s infinite;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
`;

/* ============ HERO CARD SKELETON ============ */
const HeroCardSkeleton = styled(SkeletonBase)`
  background: linear-gradient(135deg, #f0f0f0 0%, #f8f8f8 100%);
  border-radius: 16px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 28px 24px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    gap: 20px;
  }
`;

const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  height: 200px;
  border-radius: 12px;

  @media (min-width: 768px) {
    height: 240px;
  }

  @media (min-width: 1024px) {
    height: 280px;
  }
`;

const SkeletonShopName = styled(SkeletonBase)`
  width: 60%;
  height: 24px;
  border-radius: 6px;
`;

const SkeletonDescription = styled(SkeletonBase)`
  width: 80%;
  height: 14px;
  border-radius: 6px;
`;

const SkeletonMeta = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const SkeletonMetaItem = styled(SkeletonBase)`
  width: 100px;
  height: 16px;
  border-radius: 6px;
`;

/* ============ INFO CARDS SKELETON ============ */
const InfoGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const InfoCardSkeleton = styled(SkeletonBase)`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 18px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

const SkeletonIconBox = styled(SkeletonBase)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  width: 80px;
  height: 12px;
  border-radius: 6px;
`;

const SkeletonValue = styled(SkeletonBase)`
  width: 60%;
  height: 20px;
  border-radius: 6px;
`;

const SkeletonSubtext = styled(SkeletonBase)`
  width: 70%;
  height: 12px;
  border-radius: 6px;
`;

/* ============ DETAILS SECTION SKELETON ============ */
const DetailsSectionSkeleton = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 24px 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
  }
`;

const SkeletonDetailsTitle = styled(SkeletonBase)`
  width: 150px;
  height: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const DetailListSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItemSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 14px 0;
  }
`;

const SkeletonLabel = styled(SkeletonBase)`
  width: 100px;
  height: 13px;
  border-radius: 6px;
`;

const SkeletonDetailValue = styled(SkeletonBase)`
  width: 120px;
  height: 15px;
  border-radius: 6px;
`;

/* ============ BUTTONS SKELETON ============ */
const ButtonGroupSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const SkeletonButton = styled(SkeletonBase)`
  padding: 14px 16px;
  border-radius: 12px;
  height: 48px;

  @media (min-width: 768px) {
    padding: 16px;
    height: 52px;
  }
`;

export function ShopDetailsSkeleton() {
  return (
    <>
      {/* HERO CARD */}
      <HeroCardSkeleton>
        <SkeletonImage />
        <SkeletonShopName />
        <SkeletonDescription />
        <SkeletonMeta>
          <SkeletonMetaItem />
          <SkeletonMetaItem />
          <SkeletonMetaItem />
        </SkeletonMeta>
      </HeroCardSkeleton>

      {/* INFO CARDS */}
      <InfoGridSkeleton>
        {[1, 2, 3].map((i) => (
          <InfoCardSkeleton key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SkeletonIconBox />
              <SkeletonTitle />
            </div>
            <SkeletonValue />
            <SkeletonSubtext />
          </InfoCardSkeleton>
        ))}
      </InfoGridSkeleton>

      {/* DETAILS SECTION */}
      <DetailsSectionSkeleton>
        <SkeletonDetailsTitle />
        <DetailListSkeleton>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DetailItemSkeleton key={i}>
              <SkeletonLabel />
              <SkeletonDetailValue />
            </DetailItemSkeleton>
          ))}
        </DetailListSkeleton>
      </DetailsSectionSkeleton>

      {/* ACTION BUTTONS */}
      <ButtonGroupSkeleton>
        <SkeletonButton />
        <SkeletonButton />
      </ButtonGroupSkeleton>
    </>
  );
}
