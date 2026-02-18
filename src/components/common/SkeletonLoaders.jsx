'use client';

import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
`;

const CardSkeleton = styled(SkeletonBase)`
  border-radius: 12px;
  height: 320px;
  width: 100%;

  @media (min-width: 640px) {
    border-radius: 14px;
    height: 340px;
  }

  @media (min-width: 1024px) {
    border-radius: 16px;
    height: 360px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
  }
`;

const HeaderSkeleton = styled(SkeletonBase)`
  height: 40px;
  border-radius: 8px;
  margin-bottom: 16px;

  @media (min-width: 640px) {
    height: 48px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
`;

const TextSkeleton = styled(SkeletonBase)`
  height: 16px;
  border-radius: 4px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

// ===== REQUEST CARD SKELETON STYLES =====
const RequestCardSkeletonContainer = styled(SkeletonBase)`
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  height: 100%;

  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 16px;
    min-height: 300px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
    border-radius: 18px;
  }
`;

const RequestHeaderSkeleton = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
`;

const RequestCategoryBadgeSkeleton = styled(SkeletonBase)`
  width: 70px;
  height: 22px;
  border-radius: 6px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 80px;
    height: 24px;
  }
`;

const RequestStatusBadgeSkeleton = styled(SkeletonBase)`
  width: 60px;
  height: 22px;
  border-radius: 6px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 70px;
    height: 24px;
  }
`;

const RequestTitleSkeleton = styled(SkeletonBase)`
  height: 18px;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;

  @media (min-width: 640px) {
    height: 19px;
    margin-bottom: 10px;
  }
`;

const RequestTitleSecondLineSkeleton = styled(SkeletonBase)`
  height: 18px;
  border-radius: 4px;
  margin-bottom: 12px;
  width: 85%;

  @media (min-width: 640px) {
    height: 19px;
    margin-bottom: 14px;
    width: 80%;
  }
`;

const RequestMetaSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    gap: 10px;
    margin-bottom: 14px;
  }
`;

const RequestMetaItemSkeleton = styled(SkeletonBase)`
  height: 14px;
  border-radius: 4px;
  width: 90%;

  &:last-child {
    width: 75%;
  }

  @media (min-width: 640px) {
    height: 15px;
  }
`;

const RequestFooterSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  @media (min-width: 640px) {
    gap: 14px;
    padding-top: 14px;
  }
`;

const RequestPriceSkeleton = styled(SkeletonBase)`
  width: 100px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 120px;
    height: 22px;
  }
`;

const RequestOffersSkeleton = styled(SkeletonBase)`
  width: 80px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 100px;
    height: 22px;
  }
`;

export function RequestCardSkeleton() {
  return (
    <RequestCardSkeletonContainer role="status" aria-label="Loading request card">
      {/* Header with badges */}
      <RequestHeaderSkeleton>
        <RequestCategoryBadgeSkeleton />
        <RequestStatusBadgeSkeleton />
      </RequestHeaderSkeleton>

      {/* Title */}
      <RequestTitleSkeleton />
      <RequestTitleSecondLineSkeleton />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Meta information */}
      <RequestMetaSkeleton>
        <RequestMetaItemSkeleton />
        <RequestMetaItemSkeleton />
        <RequestMetaItemSkeleton />
      </RequestMetaSkeleton>

      {/* Footer with price and offers */}
      <RequestFooterSkeleton>
        <RequestPriceSkeleton />
        <RequestOffersSkeleton />
      </RequestFooterSkeleton>
    </RequestCardSkeletonContainer>
  );
}

export function RequestGridSkeleton({ count = 6 }) {
  return (
    <GridContainer role="status" aria-label="Loading requests">
      {Array.from({ length: count }).map((_, i) => (
        <RequestCardSkeleton key={i} />
      ))}
    </GridContainer>
  );
}

export function RequestDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading request details">
      <RequestDetailHeaderSkeleton />
      <RequestDetailMainSkeleton>
        <div>
          {/* Hero Section */}
          <RequestDetailHeroSkeleton />

          {/* About Request Section */}
          <RequestDetailContentSkeleton>
            <RequestDetailSectionTitleSkeleton />
            <RequestDetailDescriptionSkeleton>
              <div />
              <div />
              <div style={{ width: '85%' }} />
            </RequestDetailDescriptionSkeleton>
          </RequestDetailContentSkeleton>

          {/* Budget Section */}
          <RequestDetailContentSkeleton>
            <RequestDetailSectionTitleSkeleton />
            <RequestDetailGridSkeleton>
              <RequestDetailDetailItemSkeleton />
              <RequestDetailDetailItemSkeleton />
              <RequestDetailDetailItemSkeleton />
              <RequestDetailDetailItemSkeleton />
            </RequestDetailGridSkeleton>
          </RequestDetailContentSkeleton>

          {/* Offers Section */}
          <RequestDetailContentSkeleton>
            <RequestDetailSectionTitleSkeleton />
            <RequestDetailOfferCardSkeleton />
            <RequestDetailOfferCardSkeleton />
          </RequestDetailContentSkeleton>
        </div>

        {/* Sidebar */}
        <RequestDetailSidebarSkeleton>
          <RequestDetailSidebarCardSkeleton />
          <RequestDetailSidebarCardSkeleton />
        </RequestDetailSidebarSkeleton>
      </RequestDetailMainSkeleton>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap: '16px',
        padding: '16px',
        borderBottom: '1px solid #f0f0f0'
      }}
      role="row"
      aria-label="Loading table row"
    >
      {Array.from({ length: columns }).map((_, i) => (
        <TextSkeleton key={i} style={{ height: '20px' }} />
      ))}
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center',
        padding: '24px',
        alignItems: 'center'
      }}
      role="status"
      aria-label="Loading pagination"
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === 3 ? '150px' : '40px',
            height: '40px',
            background: '#f0f0f0',
            borderRadius: '8px'
          }}
        />
      ))}
    </div>
  );
}

// ===== REQUEST DETAIL SKELETON STYLES =====
const RequestDetailHeaderSkeleton = styled(SkeletonBase)`
  height: 60px;
  border-radius: 12px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    height: 70px;
    margin-bottom: 28px;
  }
`;

const RequestDetailMainSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 320px;
    gap: 28px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: 1fr 380px;
    gap: 32px;
  }
`;

const RequestDetailHeroSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 280px;
  border-radius: 16px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    height: 340px;
    margin-bottom: 28px;
  }

  @media (min-width: 1024px) {
    height: 380px;
  }
`;

const RequestDetailContentSkeleton = styled(SkeletonBase)`
  background: white;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);

  @media (min-width: 640px) {
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 16px;
  }
`;

const RequestDetailSectionTitleSkeleton = styled(SkeletonBase)`
  height: 20px;
  border-radius: 4px;
  margin-bottom: 18px;
  width: 30%;

  @media (min-width: 640px) {
    height: 22px;
    margin-bottom: 20px;
  }
`;

const RequestDetailDescriptionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > div {
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;

    &:last-child {
      width: 85%;
    }
  }

  @media (min-width: 640px) {
    gap: 14px;
    & > div {
      height: 17px;
    }
  }
`;

const RequestDetailGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (min-width: 640px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
`;

const RequestDetailDetailItemSkeleton = styled(SkeletonBase)`
  padding: 14px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::before {
    content: '';
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;
    width: 60%;
  }

  &::after {
    content: '';
    height: 18px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;
  }

  @media (min-width: 640px) {
    padding: 16px;
    gap: 10px;
  }
`;

const RequestDetailOfferCardSkeleton = styled(SkeletonBase)`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::before {
    content: '';
    height: 22px;
    width: 30%;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;
  }

  &::after {
    content: '';
    height: 14px;
    width: 50%;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;
  }

  @media (min-width: 640px) {
    padding: 18px;
    margin-bottom: 16px;
  }
`;

const RequestDetailSidebarSkeleton = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;

  @media (min-width: 640px) {
    gap: 24px;
    margin-top: 28px;
  }

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 0;
  }
`;

const RequestDetailSidebarCardSkeleton = styled(SkeletonBase)`
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 200px;

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 16px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    position: sticky;
    top: 100px;
  }

  @media (min-width: 1440px) {
    top: 120px;
  }
`;


const EventCardSkeletonContainer = styled(SkeletonBase)`
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  height: auto;

  @media (max-width: 640px) {
    border-radius: 12px;
  }
`;

const EventImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 200px;
  border-radius: 0;

  @media (max-width: 640px) {
    height: 180px;
  }
`;

const EventContentSkeleton = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;

  @media (max-width: 640px) {
    padding: 16px;
    gap: 12px;
  }
`;

const EventTitleSkeleton = styled(SkeletonBase)`
  height: 24px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const EventTitleLineSkeleton = styled(SkeletonBase)`
  height: 24px;
  border-radius: 8px;
  width: 85%;
`;

const EventMetaGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    gap: 10px;
  }
`;

const EventMetaItemSkeleton = styled(SkeletonBase)`
  height: 40px;
  border-radius: 10px;
`;

const EventActionBarSkeleton = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;

  @media (max-width: 640px) {
    padding: 16px;
    gap: 10px;
  }
`;

const EventButtonSkeleton = styled(SkeletonBase)`
  flex: 1;
  height: 42px;
  border-radius: 10px;
  min-width: 80px;
`;

export function EventCardSkeleton() {
  return (
    <EventCardSkeletonContainer role="status" aria-label="Loading event card">
      <EventImageSkeleton />
      <EventContentSkeleton>
        <div>
          <EventTitleSkeleton />
          <EventTitleLineSkeleton />
        </div>
        <EventMetaGridSkeleton>
          <EventMetaItemSkeleton />
          <EventMetaItemSkeleton />
          <EventMetaItemSkeleton />
          <EventMetaItemSkeleton />
        </EventMetaGridSkeleton>
      </EventContentSkeleton>
      <EventActionBarSkeleton>
        <EventButtonSkeleton />
        <EventButtonSkeleton />
      </EventActionBarSkeleton>
    </EventCardSkeletonContainer>
  );
}

export function EventGridSkeleton({ count = 6 }) {
  return (
    <GridContainer role="status" aria-label="Loading events">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </GridContainer>
  );
}

const EventDetailHeroSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 280px;
  border-radius: 16px;
  margin-bottom: 28px;

  @media (min-width: 768px) {
    height: 380px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    height: 420px;
  }
`;

const EventDetailContentSkeleton = styled(SkeletonBase)`
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 32px 28px;
    margin-bottom: 24px;
  }
`;

const EventDetailTitleSkeleton = styled(SkeletonBase)`
  height: 36px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 80%;

  @media (min-width: 768px) {
    height: 44px;
    margin-bottom: 24px;
  }
`;

const EventDetailDescriptionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > div {
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;

    &:last-child {
      width: 90%;
    }
  }
`;

const EventDetailMetaSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;
  }
`;

const EventDetailMetaItemSkeleton = styled(SkeletonBase)`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > div:first-child {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  & > div:last-child {
    height: 16px;
    width: 80%;
    border-radius: 4px;
  }
`;

const EventDetailButtonSkeleton = styled(SkeletonBase)`
  height: 48px;
  border-radius: 10px;
  flex: 1;
  min-width: 120px;
`;

const EventDetailActionBarSkeleton = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid #f0f0f0;
`;

const EventDetailLocationSkeleton = styled(SkeletonBase)`
  padding: 20px;
  border-radius: 12px;
  height: 80px;
  margin-top: 28px;
`;

export function EventDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading event details">
      <EventDetailHeroSkeleton />
      <EventDetailContentSkeleton>
        <EventDetailTitleSkeleton />
        <EventDetailDescriptionSkeleton>
          <div />
          <div />
          <div />
        </EventDetailDescriptionSkeleton>
        <EventDetailMetaSkeleton>
          <EventDetailMetaItemSkeleton>
            <div />
            <div />
          </EventDetailMetaItemSkeleton>
          <EventDetailMetaItemSkeleton>
            <div />
            <div />
          </EventDetailMetaItemSkeleton>
          <EventDetailMetaItemSkeleton>
            <div />
            <div />
          </EventDetailMetaItemSkeleton>
          <EventDetailMetaItemSkeleton>
            <div />
            <div />
          </EventDetailMetaItemSkeleton>
        </EventDetailMetaSkeleton>
        <EventDetailLocationSkeleton />
        <EventDetailActionBarSkeleton>
          <EventDetailButtonSkeleton style={{ flex: 1 }} />
          <EventDetailButtonSkeleton style={{ flex: 1 }} />
          <EventDetailButtonSkeleton style={{ flex: 1 }} />
        </EventDetailActionBarSkeleton>
      </EventDetailContentSkeleton>
    </div>
  );
}
