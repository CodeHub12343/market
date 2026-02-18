'use client';

import styled from 'styled-components';
import { useMessages } from '@/hooks/useMessages';
import { useSocket } from '@/context/SocketContext';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// ===== CONTAINER =====
const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  background: #ffffff;

  @media (min-width: 768px) {
    padding: 20px;
    gap: 4px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    gap: 6px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e5e5;
    border-radius: 3px;

    &:hover {
      background: #d0d0d0;
    }
  }
`;

// ===== MESSAGE GROUP =====
const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (min-width: 768px) {
    gap: 4px;
  }
`;

// ===== DATE DIVIDER =====
const DateDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0 12px 0;
  color: #999;
  font-size: 12px;
  font-weight: 500;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e5e5;
  }

  @media (min-width: 768px) {
    font-size: 13px;
    margin: 20px 0 16px 0;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    margin: 24px 0 20px 0;
  }
`;

// ===== EMPTY STATE =====
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  gap: 12px;
  padding: 40px 20px;

  @media (min-width: 768px) {
    min-height: 400px;
    padding: 60px 40px;
    gap: 16px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.4;

  @media (min-width: 768px) {
    font-size: 56px;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #999;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

export default function MessageList({ chatId, userId }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: messages = [], isLoading, refetch } = useMessages(chatId, 1, 50);
  const { socket, isConnected } = useSocket();
  const [liveMessages, setLiveMessages] = useState(() => {
    return Array.isArray(messages) ? messages : [];
  });
  const [typingUsers, setTypingUsers] = useState(new Set());
  const containerRef = useRef(null);

  // Sync liveMessages with API data
  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      setLiveMessages((prev) => {
        const optimisticMessages = prev.filter((m) => m?.isOptimistic);
        const combined = [
          ...messages,
          ...optimisticMessages.filter(
            (opt) => !messages.some((api) => api._id === opt._id)
          )
        ];
        return combined;
      });
    }
  }, [messages]);

  // Join chat and listen for messages
  useEffect(() => {
    if (!socket || !isConnected || !chatId) return;

    const emitJoinChat = () => {
      try {
        socket.emit('joinChat', chatId);
      } catch (error) {
        console.error('Error joining chat:', error);
      }
    };

    if (socket.io?.engine?.readyState === 'open') {
      emitJoinChat();
    } else {
      setTimeout(emitJoinChat, 500);
    }

    // Mark conversation as read
    const markAsReadAfterJoin = () => {
      try {
        if (!socket || !isConnected || !chatId) return;
        socket.emit('markConversationRead', { chatId }, (res) => {
          if (res && res.success) {
            try {
              queryClient.setQueryData(['chats', user?._id], (old) => {
                if (!Array.isArray(old)) return old;
                return old.map((c) =>
                  c._id === chatId ? { ...c, unreadCount: 0 } : c
                );
              });
              queryClient.invalidateQueries({
                queryKey: ['chats', user?._id],
                exact: false
              });
            } catch (err) {
              console.warn('Failed to update chats cache:', err?.message);
            }
          }
        });
      } catch (err) {
        console.warn('Error marking conversation as read:', err?.message);
      }
    };

    setTimeout(markAsReadAfterJoin, 300);

    // Message handler
    const messageHandler = (newMessage) => {
      if (newMessage.sender?._id === user?._id) return;

      setLiveMessages((prev) => {
        const filtered = prev.filter((m) => !m.isOptimistic);
        const exists = filtered.some((m) => m._id === newMessage._id);
        if (exists) return prev;

        return [newMessage, ...filtered];
      });

      queryClient.setQueryData(
        ['messages', user?._id, chatId, 1, 50],
        (old) => {
          const oldMessages = Array.isArray(old) ? old : [];
          if (oldMessages.some((m) => m._id === newMessage._id)) {
            return oldMessages;
          }
          return [newMessage, ...oldMessages];
        }
      );
    };

    const typingHandler = ({ userId: typingUserId, isTyping }) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        if (isTyping) {
          updated.add(typingUserId);
        } else {
          updated.delete(typingUserId);
        }
        return updated;
      });
    };

    socket.on(`message:new:${chatId}`, messageHandler);
    socket.on('newMessage', messageHandler);
    socket.on('messageReceived', messageHandler);
    socket.on('userTyping', typingHandler);

    return () => {
      socket.off(`message:new:${chatId}`, messageHandler);
      socket.off('newMessage', messageHandler);
      socket.off('messageReceived', messageHandler);
      socket.off('userTyping', typingHandler);
      socket.emit('leaveChat', chatId);
    };
  }, [socket, chatId, isConnected, user, queryClient]);

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  const filteredMessages = Array.isArray(liveMessages)
    ? liveMessages.filter((message) => message && message._id && message.sender)
    : [];

  if (filteredMessages.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyText>No messages yet. Start the conversation!</EmptyText>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container ref={containerRef}>
      {typingUsers.size > 0 && <TypingIndicator count={typingUsers.size} />}

      {filteredMessages.map((message, index) => (
        <MessageGroup key={message._id}>
          {index > 0 &&
            new Date(message.createdAt).toDateString() !==
              new Date(filteredMessages[index - 1].createdAt).toDateString() && (
              <DateDivider>
                {new Date(message.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </DateDivider>
            )}
          <MessageItem
            message={message}
            isOwn={message.sender?._id === userId}
            chatId={chatId}
          />
        </MessageGroup>
      ))}
    </Container>
  );
}
