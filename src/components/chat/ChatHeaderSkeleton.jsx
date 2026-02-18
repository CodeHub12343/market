'use client';

import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 14px 20px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    padding: 16px 24px;
    gap: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  @media (min-width: 768px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

const BackButtonSkeleton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f5f5f5 50%, #f0f0f0 75%);
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

  @media (max-width: 1023px) {
    display: flex;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const AvatarSkeleton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 50%, #e5e5e5 75%);
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
    width: 44px;
    height: 44px;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const NameSkeleton = styled.div`
  height: 18px;
  width: 140px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f5f5f5 50%, #f0f0f0 75%);
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

  @media (min-width: 768px) {
    width: 160px;
  }
`;

const StatusSkeleton = styled.div`
  height: 14px;
  width: 80px;
  background: linear-gradient(90deg, #f5f5f5 25%, #fafafa 50%, #f5f5f5 75%);
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

  @media (min-width: 768px) {
    width: 100px;
  }
`;

const RightSection = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const IconButtonSkeleton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f5f5f5 50%, #f0f0f0 75%);
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
    width: 40px;
    height: 40px;
  }
`;

export default function ChatHeaderSkeleton() {
  return (
    <Header>
      <LeftSection>
        <BackButtonSkeleton />
        <AvatarSkeleton />
        <InfoSection>
          <NameSkeleton />
          <StatusSkeleton />
        </InfoSection>
      </LeftSection>
      <RightSection>
        <IconButtonSkeleton />
        <IconButtonSkeleton style={{ display: 'none' }} />
        <IconButtonSkeleton />
      </RightSection>
    </Header>
  );
}
