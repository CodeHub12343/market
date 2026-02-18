'use client';

import styled from 'styled-components';
import { useAddReaction, useRemoveReaction } from '@/hooks/useMessages';
import { useState } from 'react';

// ===== MESSAGE CONTAINER =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${(props) =>
    props.$isOwn &&
    `
    align-items: flex-end;
  `}

  @media (min-width: 768px) {
    margin-bottom: 12px;
  }
`;

// ===== MESSAGE BUBBLE =====
const MessageBubble = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  background: ${(props) => (props.$isOwn ? '#1a1a1a' : '#f0f0f0')};
  color: ${(props) => (props.$isOwn ? '#ffffff' : '#1a1a1a')};
  border-radius: 16px;
  word-wrap: break-word;
  position: relative;
  box-shadow: ${(props) =>
    props.$isOwn
      ? '0 2px 8px rgba(26, 26, 26, 0.12)'
      : '0 2px 8px rgba(0, 0, 0, 0.06)'};
  transition: box-shadow 0.2s ease;

  ${(props) =>
    props.$isOwn
      ? `
    border-bottom-right-radius: 4px;
  `
      : `
    border-bottom-left-radius: 4px;
  `}

  &:hover {
    box-shadow: ${(props) =>
      props.$isOwn
        ? '0 4px 12px rgba(26, 26, 26, 0.15)'
        : '0 4px 12px rgba(0, 0, 0, 0.08)'};
  }

  @media (min-width: 768px) {
    max-width: 75%;
    padding: 12px 16px;
  }

  @media (min-width: 1024px) {
    max-width: 60%;
  }
`;

// ===== MESSAGE TEXT =====
const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

// ===== MESSAGE TIME =====
const MessageTime = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 14px;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 12px;
    padding: 0 16px;
  }
`;

// ===== REACTIONS CONTAINER =====
const ReactionsContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 6px;
  padding: 0 14px;
  ${(props) => props.$isOwn && 'justify-content: flex-end;'}

  @media (min-width: 768px) {
    gap: 6px;
    margin-top: 8px;
    padding: 0 16px;
  }
`;

// ===== REACTION BUTTON =====
const Reaction = styled.button`
  padding: 4px 8px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: #f9f9f9;
    border-color: #d0d0d0;
  }

  &:active {
    background: #f0f0f0;
    border-color: #c0c0c0;
  }

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 4px 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
  }
`;

// ===== EMOJI PICKER =====
const EmojiPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  position: absolute;
  bottom: -280px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 280px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(8, 1fr);
    padding: 16px;
    gap: 6px;
  }
`;

// ===== EMOJI BUTTON =====
const Emoji = styled.button`
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease, background 0.15s ease;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: #f5f5f5;
    transform: scale(1.15);
  }

  &:active {
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    font-size: 20px;
    padding: 8px;
  }
`;

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '💯'];

export default function MessageItem({ message, isOwn, chatId }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { mutateAsync: addReaction } = useAddReaction();
  const { mutateAsync: removeReaction } = useRemoveReaction();

  const handleAddReaction = async (emoji) => {
    try {
      await addReaction({ messageId: message._id, emoji });
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleRemoveReaction = async (emoji) => {
    try {
      await removeReaction({ messageId: message._id, emoji });
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container $isOwn={isOwn}>
      <MessageBubble $isOwn={isOwn}>
        <MessageText>{message.text || message.content}</MessageText>
      </MessageBubble>

      <MessageTime>{formatTime(message.createdAt)}</MessageTime>
    </Container>
  );
}
