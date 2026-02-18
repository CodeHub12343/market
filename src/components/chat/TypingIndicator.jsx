'use client';

import styled, { keyframes } from 'styled-components';

// ===== ANIMATIONS =====
const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  40% {
    transform: translateY(-8px);
    opacity: 1;
  }
`;

// ===== CONTAINER =====
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    padding: 12px 20px;
    gap: 10px;
  }

  @media (min-width: 1024px) {
    padding: 12px 24px;
  }
`;

// ===== ANIMATED DOTS =====
const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite cubic-bezier(0.4, 0, 0.6, 1);

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0s;
  }

  @media (min-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

// ===== TEXT LABEL =====
const Text = styled.div`
  font-size: 12px;
  color: #999;
  margin-left: 2px;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: 0.3px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

export default function TypingIndicator({ count = 1 }) {
  return (
    <Container>
      <Dot />
      <Dot />
      <Dot />
      <Text>
        {count === 1 
          ? 'Someone is typing...' 
          : `${count} ${count === 2 ? 'person' : 'people'} typing...`}
      </Text>
    </Container>
  );
}
