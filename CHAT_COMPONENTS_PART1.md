# Complete Chat Component Code

Copy the following code files into your project:

## 1. src/components/chat/ChatHeader.jsx
```jsx
import styled from 'styled-components';
import { useMemo } from 'react';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Status = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s;
  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

export const ChatHeader = ({ conversation, currentUserId }) => {
  const { displayName, displayAvatar, memberCount } = useMemo(() => {
    if (!conversation) return { displayName: '', displayAvatar: null, memberCount: 0 };
    if (conversation.type === 'group') {
      return {
        displayName: conversation.name || 'Group Chat',
        displayAvatar: conversation.avatar?.url,
        memberCount: conversation.members?.length || 0,
      };
    }
    const otherMember = conversation.members?.find(
      (member) => member._id !== currentUserId
    );
    return {
      displayName: otherMember?.fullName || otherMember?.name || 'User',
      displayAvatar: otherMember?.photo || otherMember?.avatar,
      memberCount: 2,
    };
  }, [conversation, currentUserId]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!conversation) return null;

  return (
    <HeaderContainer>
      <Avatar>
        {displayAvatar ? (
          <AvatarImage src={displayAvatar} alt={displayName} />
        ) : (
          getInitials(displayName)
        )}
      </Avatar>
      <Info>
        <Name>{displayName}</Name>
        <Status>
          {conversation.type === 'group'
            ? `${memberCount} members`
            : 'Active now'}
        </Status>
      </Info>
      <Actions>
        <IconButton title="Call">📞</IconButton>
        <IconButton title="Video call">📹</IconButton>
        <IconButton title="More options">⋮</IconButton>
      </Actions>
    </HeaderContainer>
  );
};
```

## 2. src/components/chat/TypingIndicator.jsx
```jsx
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
`;

const Container = styled.div`
  padding: 8px 20px;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dots = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay || '0s'};
`;

export const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  const displayText =
    users.length === 1
      ? `${users[0].name || 'Someone'} is typing`
      : `${users.length} people are typing`;

  return (
    <Container>
      <span>{displayText}</span>
      <Dots>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </Dots>
    </Container>
  );
};
```

## Continue with remaining components in next file...
```

Due to character limits, I'll create the pages now:
