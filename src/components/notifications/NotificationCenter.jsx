'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, Settings, Trash2, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import NotificationItem from '@/components/notifications/NotificationItem';
import {
  useUnreadCount,
  useUnreadNotifications,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteAllNotifications
} from '@/hooks/useNotifications';

const BellButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1a1a1a;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #dc2626;
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DropdownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;

  @media (max-width: 640px) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 100;
  margin-top: 8px;
  max-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1023px) {
    width: 360px;
  }

  @media (max-width: 640px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 85vh;
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 17px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #666;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1a1a1a;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }

  @media (min-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #999;
  text-align: center;
  gap: 8px;

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
  }

  p {
    font-size: 14px;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }
`;

const DropdownFooter = styled.div`
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
  background: #f9fafb;
  flex-shrink: 0;

  @media (min-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
`;

const FooterLink = styled(Link)`
  flex: 1;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #666;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 11px 14px;
  }
`;

const FooterButton = styled.button`
  flex: 1;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #666;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 11px 14px;
  }
`;

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const { data: unreadCount = 0 } = useUnreadCount(isOpen);
  const { data: notifications = [] } = useUnreadNotifications(50, isOpen);
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAllNotifications = useDeleteAllNotifications();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDeleteNotification = (id) => {
    deleteNotification.mutate(id);
  };

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all notifications?')) {
      deleteAllNotifications.mutate();
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <BellButton onClick={() => setIsOpen(!isOpen)} title="Notifications">
        <Bell />
        {unreadCount > 0 && <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>}
      </BellButton>

      {isOpen && (
        <>
          <DropdownOverlay onClick={() => setIsOpen(false)} />
          <DropdownContainer>
            <DropdownHeader>
              <HeaderTitle>Notifications</HeaderTitle>
              <HeaderActions>
                {unreadCount > 0 && (
                  <IconButton
                    onClick={handleMarkAllAsRead}
                    disabled={markAllAsRead.isPending}
                    title="Mark all as read"
                  >
                    <CheckCheck />
                  </IconButton>
                )}
                <IconButton
                  onClick={handleDeleteAll}
                  disabled={notifications.length === 0 || deleteAllNotifications.isPending}
                  title="Delete all"
                >
                  <Trash2 />
                </IconButton>
              </HeaderActions>
            </DropdownHeader>

            {notifications.length > 0 ? (
              <NotificationsList>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification._id || notification.id}
                    notification={notification}
                    onDelete={handleDeleteNotification}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </NotificationsList>
            ) : (
              <EmptyState>
                <Bell />
                <p>No notifications yet</p>
              </EmptyState>
            )}

            <DropdownFooter>
              <FooterLink href="/notifications">
                View All
              </FooterLink>
              <FooterLink href="/settings/notifications">
                <Settings size={14} style={{ marginRight: '4px' }} />
                Settings
              </FooterLink>
            </DropdownFooter>
          </DropdownContainer>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
