'use client';

import styled from 'styled-components';
import { useAllChats } from '@/hooks/useChats';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import ChatListSkeleton from '@/components/chat/ChatListSkeleton';
import ErrorAlert from '@/components/common/ErrorAlert';
import { MessageCircle, Clock, Users } from 'lucide-react';

// ===== CONTAINER & STRUCTURE =====
const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: none;

  @media (min-width: 1024px) {
    border-right: 1px solid #f0f0f0;
  }
`;

// ===== CHATS LIST =====
const ChatsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  @media (min-width: 1024px) {
    background: #ffffff;
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

// ===== CHAT ITEM CARD =====
const ChatItemCard = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  display: flex;
  gap: 12px;
  align-items: stretch;

  &:active {
    background: #f9f9f9;
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    padding: 14px 16px;
    gap: 14px;

    &:hover {
      background: #f9f9f9;
    }
  }

  @media (min-width: 1024px) {
    padding: 12px 12px;
    border-radius: 0;

    &:hover {
      background: #f5f5f5;
    }
  }

  ${(props) =>
    props.$active &&
    `
    background: #f0f4ff;
    border-left: 3px solid #1a1a1a;
    padding-left: 13px;

    @media (min-width: 1024px) {
      background: #f0f4ff;
      border-radius: 8px;
      border-left: none;
      padding-left: 12px;
    }
  `}

  ${(props) =>
    props.$hasUnread &&
    !props.$active &&
    `
    background: #f9f9f9;
    border-left: 3px solid #1a1a1a;
    padding-left: 13px;

    @media (min-width: 1024px) {
      border-left: none;
      padding-left: 12px;
    }
  `}
`;

// ===== AVATAR =====
const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: white;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;

  @media (min-width: 768px) {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => (props.$online ? '#22c55e' : '#e5e5e5')};
  border: 3px solid white;

  @media (min-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

// ===== CONTENT SECTION =====
const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  justify-content: center;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const ChatName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;

  ${(props) =>
    props.$unread &&
    `
    font-weight: 600;
    color: #1a1a1a;
  `}

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const TypingIndicator = styled.div`
  font-size: 12px;
  color: #667eea;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #667eea;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0%,
    60%,
    100% {
      opacity: 0.5;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-6px);
    }
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

// ===== BADGES =====
const BadgesContainer = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
`;

const UnreadBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: #1a1a1a;
  color: white;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @media (min-width: 768px) {
    min-width: 24px;
    height: 24px;
    font-size: 12px;
    padding: 0 7px;
  }
`;

const GroupBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #f0f0f0;
  color: #666;
  font-size: 12px;

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 13px;
  }

  svg {
    width: 14px;
    height: 14px;

    @media (min-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
`;

// ===== EMPTY STATE =====
const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 20px;
  text-align: center;
  gap: 12px;
  flex: 1;

  @media (min-width: 768px) {
    min-height: 400px;
    padding: 60px 40px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    min-height: 500px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.5;

  @media (min-width: 768px) {
    font-size: 56px;
  }
`;

const EmptyTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  max-width: 280px;

  @media (min-width: 768px) {
    font-size: 13px;
    max-width: 320px;
  }
`;

// ===== ERROR STATE =====
const ErrorContainer = styled.div`
  padding: 16px;
  margin: 12px;
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 8px;
  color: #c62828;
  font-size: 13px;
  text-align: center;

  @media (min-width: 768px) {
    padding: 20px;
    margin: 16px;
  }
`;

export default function ChatList({ searchQuery = '', filterType = 'all' }) {
  const router = useRouter();
  const params = useParams();
  const currentChatId = params?.chatId;
  const { user } = useAuth();
  const { data: chats = [], isLoading, error } = useAllChats();
  const { socket, isConnected, onlineUsers, setOnlineUsers } = useSocket();
  const [updatedChats, setUpdatedChats] = useState([]);
  const queryClient = useQueryClient();
  const refetchTimer = useRef(null);

  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  const displayUnreadCounts = useMemo(() => {
    let counts = {};
    if (chats && chats.length > 0) {
      counts = chats.reduce((acc, chat) => {
        acc[chat._id] = chat.unreadCount || 0;
        return acc;
      }, {});
    }
    return { ...counts, ...unreadCounts };
  }, [chats, unreadCounts]);

  const normalizeId = (id) => {
    if (!id) return '';
    const str = id.toString();
    return str.toLowerCase().trim();
  };

  const getReceiverInfo = (chat) => {
    if (chat.type === 'group') {
      return {
        name: chat.name || 'Group Chat',
        isOnline: false,
        receiver: null,
        isGroup: true
      };
    }

    const currentUserId = normalizeId(user?._id || user?.id);
    const receiver = chat.members?.find((m) => {
      const memberId = normalizeId(m._id || m.id);
      return memberId !== currentUserId;
    });

    const receiverId = receiver ? normalizeId(receiver._id || receiver.id) : '';
    const isOnline = receiver ? onlineUsers.includes(receiverId) : false;

    return {
      name: receiver?.fullName || receiver?.name || 'Unknown User',
      isOnline,
      receiver,
      isGroup: false
    };
  };

  // Format time display
  const formatTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Filter chats based on search and type
  const filteredChats = useMemo(() => {
    let filtered = updatedChats.length > 0 ? updatedChats : chats;

    // Filter by type
    if (filterType === 'direct') {
      filtered = filtered.filter((c) => c.type !== 'group');
    } else if (filterType === 'groups') {
      filtered = filtered.filter((c) => c.type === 'group');
    } else if (filterType === 'unread') {
      filtered = filtered.filter((c) => displayUnreadCounts[c._id] > 0);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((chat) => {
        const receiverInfo = getReceiverInfo(chat);
        return (
          receiverInfo.name.toLowerCase().includes(query) ||
          (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query))
        );
      });
    }

    return filtered;
  }, [updatedChats, chats, filterType, searchQuery, displayUnreadCounts]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      if (message.chatId !== currentChatId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1
        }));
      }

      setUpdatedChats((prevChats) => {
        const chatsToUpdate = prevChats && prevChats.length > 0 ? prevChats : chats;

        if (!chatsToUpdate || chatsToUpdate.length === 0) {
          return [];
        }

        const updated = chatsToUpdate.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              lastMessage: message.content || '[File attachment]',
              lastMessageTime: message.createdAt || new Date().toISOString(),
              updatedAt: message.createdAt || new Date().toISOString(),
              lastMessageSender: message.sender
            };
          }
          return chat;
        });

        return updated.sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.createdAt);
          const timeB = new Date(b.updatedAt || b.createdAt);
          return timeB - timeA;
        });
      });
    };

    const handleTypingStatus = (data) => {
      const { chatId, userId, isTyping } = data;
      setTypingUsers((prev) => {
        const chatTyping = prev[chatId] || {};
        if (isTyping) {
          return {
            ...prev,
            [chatId]: {
              ...chatTyping,
              [userId]: true
            }
          };
        } else {
          const updated = { ...chatTyping };
          delete updated[userId];
          return {
            ...prev,
            [chatId]: updated
          };
        }
      });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageReceived', handleNewMessage);
    socket.on('userTyping', handleTypingStatus);
    socket.on('typingStatus', handleTypingStatus);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageReceived', handleNewMessage);
      socket.off('userTyping', handleTypingStatus);
      socket.off('typingStatus', handleTypingStatus);
    };
  }, [socket, isConnected, currentChatId, chats]);

  const displayChats = updatedChats.length > 0 ? updatedChats : chats;

  if (isLoading) {
    return <ChatListSkeleton />;
  }

  return (
    <Container>
      {error && (
        <ErrorContainer>
          <div>Failed to load chats. Please try again.</div>
        </ErrorContainer>
      )}

      <ChatsList>
        {filteredChats && filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const receiverInfo = getReceiverInfo(chat);
            const isTyping =
              typingUsers[chat._id] &&
              Object.keys(typingUsers[chat._id]).length > 0;
            const unreadCount = displayUnreadCounts[chat._id] || 0;
            const avatarText = receiverInfo.name.charAt(0).toUpperCase();

            return (
              <ChatItemCard
                key={chat._id}
                $active={currentChatId === chat._id}
                $hasUnread={unreadCount > 0}
                onClick={async () => {
                  router.push(`/messages/${chat._id}`);
                  setUnreadCounts((prev) => ({
                    ...prev,
                    [chat._id]: 0
                  }));

                  if (socket && isConnected) {
                    try {
                      socket.emit('markConversationRead', { chatId: chat._id });
                    } catch (err) {
                      console.warn('Failed to emit markConversationRead:', err);
                    }
                  }
                }}
                title={chat.lastMessage || 'No messages yet'}
              >
                {/* AVATAR */}
                <AvatarContainer>
                  {avatarText}
                  {!receiverInfo.isGroup && (
                    <OnlineIndicator $online={receiverInfo.isOnline} />
                  )}
                </AvatarContainer>

                {/* CONTENT */}
                <ContentSection>
                  <HeaderRow>
                    <ChatName>{receiverInfo.name}</ChatName>
                    <TimeStamp>
                      {formatTime(
                        chat.lastMessageTime ||
                          chat.updatedAt ||
                          chat.createdAt
                      )}
                    </TimeStamp>
                  </HeaderRow>

                  {isTyping ? (
                    <TypingIndicator>
                      <span>typing</span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </TypingIndicator>
                  ) : (
                    <LastMessage $unread={unreadCount > 0}>
                      {chat.lastMessage || 'No messages yet'}
                    </LastMessage>
                  )}
                </ContentSection>

                {/* BADGES */}
                <BadgesContainer>
                  {receiverInfo.isGroup && <GroupBadge><Users size={14} /></GroupBadge>}
                  {unreadCount > 0 && (
                    <UnreadBadge>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </UnreadBadge>
                  )}
                </BadgesContainer>
              </ChatItemCard>
            );
          })
        ) : (
          <EmptyStateContainer>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery
                ? 'Try searching with different keywords'
                : 'Start a new conversation to begin chatting'}
            </EmptyDescription>
          </EmptyStateContainer>
        )}
      </ChatsList>
    </Container>
  );
}
