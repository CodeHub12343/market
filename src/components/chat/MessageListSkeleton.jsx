'use client';

import styled from 'styled-components';

const SkeletonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  background: #f9f9f9;

  @media (min-width: 768px) {
    padding: 20px;
    gap: 20px;
  }
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonMessage = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-direction: ${props => props.$isOwn ? 'row-reverse' : 'row'};
`;

const SkeletonAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 60%;
  align-items: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
`;

const SkeletonBubble = styled.div`
  padding: 10px 14px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 50%, #e5e5e5 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  min-height: 40px;
  width: ${props => props.$width || '200px'};

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    min-height: 44px;
    max-width: 500px;
  }
`;

const SkeletonTime = styled.div`
  height: 12px;
  width: 50px;
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
`;

export default function MessageListSkeleton() {
  const skeletonMessages = [
    { isOwn: false, width: '180px' },
    { isOwn: false, width: '220px' },
    { isOwn: true, width: '160px' },
    { isOwn: true, width: '200px' },
    { isOwn: false, width: '240px' },
    { isOwn: false, width: '190px' },
    { isOwn: true, width: '210px' },
  ];

  return (
    <SkeletonContainer>
      {skeletonMessages.map((msg, idx) => (
        <MessageGroup key={idx}>
          <SkeletonMessage $isOwn={msg.isOwn}>
            {!msg.isOwn && <SkeletonAvatar />}
            <MessageContent $isOwn={msg.isOwn}>
              <SkeletonBubble $width={msg.width} />
              <SkeletonTime />
            </MessageContent>
            {msg.isOwn && <SkeletonAvatar />}
          </SkeletonMessage>
        </MessageGroup>
      ))}
    </SkeletonContainer>
  );
}
