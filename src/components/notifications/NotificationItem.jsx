'use client';

import React from 'react';
import styled from 'styled-components';
import { X, Bell, MessageSquare, Users, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ItemContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: ${props => props.isRead ? '#ffffff' : '#f0f7ff'};
  border: 1px solid ${props => props.isRead ? '#e5e7eb' : '#cce5ff'};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.isRead ? '#f9fafb' : '#dbeafe'};
    border-color: ${props => props.isRead ? '#d1d5db' : '#a5d8ff'};
  }

  @media (min-width: 768px) {
    padding: 14px;
    gap: 14px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'event_reminder': return '#dbeafe';
      case 'event_update': return '#dcfce7';
      case 'comment': return '#fbcfe8';
      case 'reply': return '#fbcfe8';
      case 'attendee_joined': return '#fef3c7';
      case 'event_cancelled': return '#fee2e2';
      default: return '#e5e7eb';
    }
  }};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    color: ${props => {
      switch (props.type) {
        case 'event_reminder': return '#0369a1';
        case 'event_update': return '#15803d';
        case 'comment': return '#be185d';
        case 'reply': return '#be185d';
        case 'attendee_joined': return '#92400e';
        case 'event_cancelled': return '#991b1b';
        default: return '#666';
      }
    }};
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const Message = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const TimeAndAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
`;

const TimeText = styled.span`
  font-size: 12px;
  color: #999;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ActionLink = styled(Link)`
  font-size: 12px;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.2s;

  &:hover {
    color: #3730a3;
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  transition: color 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 768px) {
    padding: 6px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const UnreadBadge = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4f46e5;
  flex-shrink: 0;
  margin-left: auto;
`;

const NotificationItem = ({
  notification,
  onRead = () => {},
  onDelete = () => {},
  onClick = () => {}
}) => {
  const {
    _id,
    id,
    title,
    message,
    type,
    read = false,
    createdAt,
    actionUrl,
    relatedEventId,
    relatedUserId
  } = notification;

  const getIcon = () => {
    switch (type) {
      case 'event_reminder':
        return <Calendar />;
      case 'event_update':
        return <CheckCircle />;
      case 'comment':
      case 'reply':
        return <MessageSquare />;
      case 'attendee_joined':
        return <Users />;
      case 'event_cancelled':
        return <AlertCircle />;
      default:
        return <Bell />;
    }
  };

  const getActionUrl = () => {
    if (actionUrl) return actionUrl;
    if (relatedEventId) return `/events/${relatedEventId}`;
    return '#';
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now - notifDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  const handleClick = () => {
    if (!read) {
      onRead(_id || id);
    }
    onClick();
  };

  return (
    <ItemContainer isRead={read} onClick={handleClick}>
      <IconContainer type={type}>
        {getIcon()}
      </IconContainer>

      <ContentContainer>
        <Title>{title}</Title>
        {message && <Message>{message}</Message>}
        <TimeAndAction>
          <TimeText>{formatTime(createdAt)}</TimeText>
          {actionUrl || relatedEventId ? (
            <ActionLink href={getActionUrl()}>
              View
            </ActionLink>
          ) : null}
        </TimeAndAction>
      </ContentContainer>

      {!read && <UnreadBadge />}

      <CloseButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete(_id || id);
        }}
        title="Dismiss notification"
      >
        <X />
      </CloseButton>
    </ItemContainer>
  );
};

export default NotificationItem;
