'use client';

import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { useChat } from '@/hooks/useChats';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/context/NotificationContext';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatHeaderSkeleton from '@/components/chat/ChatHeaderSkeleton';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import MessageListSkeleton from '@/components/chat/MessageListSkeleton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useEffect } from 'react';

// ===== CONTAINER STRUCTURE =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 50;

  @media (min-width: 1024px) {
    position: relative;
    height: 100%;
  }
`;

// ===== CONTENT AREA =====
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f9f9f9;
`;

// ===== LOADING OVERLAY =====
const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
  background: #ffffff;
`;

// ===== RECONNECTING MESSAGE =====
const ReconnectingMessage = styled.div`
  padding: 10px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  color: #78350f;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
  border-bottom: 1px solid #fdc034;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    padding: 12px 20px;
    font-size: 13px;
  }
`;

export default function ChatPage() {
  // Use useParams hook for 'use client' components in Next.js 14 App Router
  const params = useParams();
  const chatId = params?.chatId;

  const { user } = useAuth();
  const { data: chat, isLoading, error } = useChat(chatId);
  const { isConnected, socket } = useSocket();
  const { showNotification } = useNotification();

  if (!chatId) {
    return (
      <Container>
        <ErrorAlert message="Chat ID not found" />
      </Container>
    );
  }

  // Listen for new messages and show notifications
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      // Only notify if the message is from another user
      if (message.sender?._id !== user?._id) {
        const senderName = message.sender?.fullName || 'Someone';
        const preview = message.content?.substring(0, 50) || 'Sent a message';

        showNotification('info', `${senderName}`, preview, 3000);
      }
    };

    // Listen for message events
    socket.on('newMessage', handleNewMessage);
    socket.on('messageReceived', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageReceived', handleNewMessage);
    };
  }, [socket, isConnected, user, showNotification]);

  if (isLoading) {
    return (
      <Container>
        <ChatHeaderSkeleton />
        <Content>
          <MessageListSkeleton />
        </Content>
      </Container>
    );
  }

  if (error || !chat) {
    return (
      <Container>
        <ErrorAlert message="Failed to load chat" />
      </Container>
    );
  }

  return (
    <Container>
      <ChatHeader chat={chat} />

      <Content>
        {!isConnected && <ReconnectingMessage>Reconnecting...</ReconnectingMessage>}

        <MessageList chatId={chatId} userId={user?._id} />
        <MessageInput chatId={chatId} />
      </Content>
    </Container>
  );
}

