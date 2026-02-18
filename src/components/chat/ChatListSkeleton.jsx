'use client';

import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const SkeletonsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const SkeletonChatItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  align-items: center;

  @media (min-width: 768px) {
    padding: 14px 16px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 12px 12px;
  }
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

  @media (min-width: 768px) {
    width: 52px;
    height: 52px;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
`;

const SkeletonTitle = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  flex: 1;
  max-width: 150px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    height: 17px;
    max-width: 180px;
  }
`;

const SkeletonTime = styled.div`
  height: 14px;
  width: 60px;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: shimmerSlow 2s infinite;
  border-radius: 4px;
  flex-shrink: 0;

  @keyframes shimmerSlow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    height: 15px;
    width: 65px;
  }
`;

const SkeletonMessage = styled.div`
  height: 13px;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: shimmerSlow 2s infinite;
  border-radius: 4px;
  width: 85%;

  @keyframes shimmerSlow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    height: 14px;
    width: 80%;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
`;

const SkeletonBadge = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

export default function ChatListSkeleton() {
  return (
    <Container>
      <SkeletonsList>
        {[...Array(8)].map((_, i) => (
          <SkeletonChatItem key={i}>
            <SkeletonAvatar />
            <ContentSection>
              <HeaderRow>
                <SkeletonTitle />
                <SkeletonTime />
              </HeaderRow>
              <SkeletonMessage />
            </ContentSection>
            <BadgesContainer>
              <SkeletonBadge />
            </BadgesContainer>
          </SkeletonChatItem>
        ))}
      </SkeletonsList>
    </Container>
  );
}
