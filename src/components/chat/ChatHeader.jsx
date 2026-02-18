'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/context/SocketContext';
import { ChevronLeft, Phone, Info, MoreVertical } from 'lucide-react';

// ===== HEADER CONTAINER =====
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
    border-bottom: 1px solid #f0f0f0;
  }
`;

// ===== BACK BUTTON (MOBILE ONLY) =====
const BackButton = styled.button`
  display: none;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #1a1a1a;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s ease;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: #f5f5f5;
    transform: scale(0.95);
  }

  @media (max-width: 1023px) {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f5f5f5;
    }
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

// ===== CHAT INFO SECTION =====
const ChatInfoSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  @media (min-width: 768px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

// ===== AVATAR CONTAINER =====
const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: white;
  font-weight: 700;
  font-size: 16px;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${(props) => (props.$online ? '#22c55e' : '#d1d5db')};
  border: 2px solid white;
  box-shadow: 0 0 0 1px #f0f0f0;

  @media (min-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

// ===== CHAT DETAILS =====
const ChatDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const ChatName = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const StatusText = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  span.indicator {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(props) => (props.$online ? '#22c55e' : '#d1d5db')};
    flex-shrink: 0;
  }
`;

// ===== ACTIONS CONTAINER =====
const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    gap: 12px;
  }

  @media (min-width: 1024px) {
    gap: 8px;
  }
`;

// ===== ACTION BUTTON =====
const ActionButton = styled.button`
  display: none;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease, background 0.2s ease;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #1a1a1a;
      background: #f5f5f5;
    }

    &:active {
      background: #e5e5e5;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ===== MORE BUTTON (ALWAYS VISIBLE) =====
const MoreButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease, background 0.2s ease;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;
  position: relative;

  &:active {
    background: #f5f5f5;
  }

  @media (min-width: 768px) {
    &:hover {
      color: #1a1a1a;
      background: #f5f5f5;
    }

    &:active {
      background: #e5e5e5;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ===== DROPDOWN MENU =====
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 200px;
  z-index: 1000;
  margin-top: 8px;
  overflow: hidden;

  @media (min-width: 768px) {
    border: 1px solid #e5e5e5;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #1a1a1a;
  transition: background 0.15s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;

  &:hover {
    background: #f5f5f5;
  }

  &:active {
    background: #e5e5e5;
  }

  ${(props) =>
    props.$danger &&
    `
    color: #dc2626;
    
    &:hover {
      background: #fee2e2;
    }
  `}

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

export default function ChatHeader({ chat }) {
  const router = useRouter();
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [showMenu, setShowMenu] = useState(false);

  const getReceiverInfo = () => {
    if (chat.type === 'group') {
      return {
        name: chat.name || 'Group Chat',
        isOnline: false,
        memberCount: chat.members?.length || 0,
        isGroup: true
      };
    }

    const normalizeId = (id) => {
      if (!id) return '';
      return id.toString().toLowerCase().trim();
    };

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

  const getStatusText = () => {
    const info = getReceiverInfo();

    if (info.isGroup) {
      return `${info.memberCount} ${info.memberCount === 1 ? 'member' : 'members'}`;
    }

    return info.isOnline ? 'Online' : 'Offline';
  };

  const receiverInfo = getReceiverInfo();
  const avatarText = receiverInfo.name.charAt(0).toUpperCase();

  return (
    <Header>
      <BackButton onClick={() => router.back()} title="Back">
        <ChevronLeft size={24} />
      </BackButton>

      <ChatInfoSection>
        {/* AVATAR */}
        <AvatarContainer>
          <Avatar>{avatarText}</Avatar>
          {!receiverInfo.isGroup && (
            <OnlineIndicator $online={receiverInfo.isOnline} />
          )}
        </AvatarContainer>

        {/* CHAT NAME & STATUS */}
        <ChatDetails>
          <ChatName>{receiverInfo.name}</ChatName>
          <StatusText $online={receiverInfo.isOnline}>
            <span className="indicator" />
            {getStatusText()}
          </StatusText>
        </ChatDetails>
      </ChatInfoSection>

      {/* ACTIONS */}
      <ActionsContainer>
        <ActionButton title="Audio call">
          <Phone size={20} />
        </ActionButton>

        <ActionButton title="Chat info">
          <Info size={20} />
        </ActionButton>

        <div style={{ position: 'relative' }}>
          <MoreButton
            onClick={() => setShowMenu(!showMenu)}
            title="More options"
          >
            <MoreVertical size={20} />
          </MoreButton>

          {showMenu && (
            <DropdownMenu>
              <MenuButton onClick={() => setShowMenu(false)}>
                <span>🔔</span>
                Notifications
              </MenuButton>
              <MenuButton onClick={() => setShowMenu(false)}>
                <span>🔍</span>
                Search
              </MenuButton>
              <MenuButton onClick={() => setShowMenu(false)}>
                <span>📦</span>
                Archive
              </MenuButton>
              <MenuButton $danger onClick={() => setShowMenu(false)}>
                <span>🗑️</span>
                Delete Chat
              </MenuButton>
            </DropdownMenu>
          )}
        </div>
      </ActionsContainer>
    </Header>
  );
}
