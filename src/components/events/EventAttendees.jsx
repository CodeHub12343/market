'use client';

import React from 'react';
import styled from 'styled-components';
import { Users, UserCheck, UserX, Download } from 'lucide-react';

const AttendeeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const AttendeeStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'total': return '#f0f7ff';
      case 'confirmed': return '#dcfce7';
      case 'pending': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'total': return '#cce5ff';
      case 'confirmed': return '#bbf7d0';
      case 'pending': return '#fde68a';
      default: return '#e5e7eb';
    }
  }};
  border-radius: 8px;
  padding: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch (props.type) {
      case 'total': return '#0369a1';
      case 'confirmed': return '#15803d';
      case 'pending': return '#92400e';
      default: return '#666';
    }
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${props => {
    switch (props.type) {
      case 'total': return '#0369a1';
      case 'confirmed': return '#15803d';
      case 'pending': return '#d97706';
      default: return '#1a1a1a';
    }
  }};

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const AttendeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttendeeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
    gap: 14px;
  }
`;

const AttendeeAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #e5e7eb;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const AttendeeAvatarPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
`;

const AttendeeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AttendeeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const AttendeeJoinDate = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'confirmed': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'declined': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'confirmed': return '#15803d';
      case 'pending': return '#d97706';
      case 'declined': return '#dc2626';
      default: return '#666';
    }
  }};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #999;
  transition: color 0.2s;
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
    padding: 8px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #666;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1a1a1a;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 768px) {
    padding: 11px 18px;
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;

  @media (min-width: 768px) {
    padding: 48px 24px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
`;

const EventAttendees = ({ attendees = [], capacity, isOrganizer = false, eventId = '' }) => {
  // Default attendees for demo
  const defaultAttendees = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      joinedDate: '2024-01-10',
      status: 'confirmed',
      profileImage: null
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      joinedDate: '2024-01-12',
      status: 'confirmed',
      profileImage: null
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      joinedDate: '2024-01-13',
      status: 'pending',
      profileImage: null
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@example.com',
      joinedDate: '2024-01-14',
      status: 'confirmed',
      profileImage: null
    },
    {
      id: 5,
      name: 'Emma Taylor',
      email: 'emma@example.com',
      joinedDate: '2024-01-15',
      status: 'confirmed',
      profileImage: null
    }
  ];

  const attendeesList = attendees && attendees.length > 0 ? attendees : defaultAttendees;
  const confirmedCount = attendeesList.filter(a => a.status === 'confirmed').length;
  const pendingCount = attendeesList.filter(a => a.status === 'pending').length;
  const totalCount = attendeesList.length;
  const capacityPercentage = capacity ? Math.round((totalCount / capacity) * 100) : 0;

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownloadAttendees = () => {
    const csv = [
      ['Name', 'Email', 'Status', 'Join Date'],
      ...attendeesList.map(a => [a.name, a.email, a.status, a.joinedDate])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${eventId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AttendeeContainer>
      {/* Stats */}
      <AttendeeStats>
        <StatCard type="total">
          <StatLabel type="total">Total Attendees</StatLabel>
          <StatValue type="total">
            {totalCount}{capacity && `/${capacity}`}
          </StatValue>
        </StatCard>
        <StatCard type="confirmed">
          <StatLabel type="confirmed">Confirmed</StatLabel>
          <StatValue type="confirmed">{confirmedCount}</StatValue>
        </StatCard>
        <StatCard type="pending">
          <StatLabel type="pending">Pending</StatLabel>
          <StatValue type="pending">{pendingCount}</StatValue>
        </StatCard>
      </AttendeeStats>

      {/* Download Button for Organizers */}
      {isOrganizer && attendeesList.length > 0 && (
        <DownloadButton onClick={handleDownloadAttendees}>
          <Download />
          Download Attendees
        </DownloadButton>
      )}

      {/* Attendee List */}
      {attendeesList && attendeesList.length > 0 ? (
        <AttendeeList>
          {attendeesList.map(attendee => (
            <AttendeeItem key={attendee.id || attendee._id}>
              {attendee.profileImage ? (
                <AttendeeAvatar src={attendee.profileImage} alt={attendee.name} />
              ) : (
                <AttendeeAvatarPlaceholder>{getInitials(attendee.name)}</AttendeeAvatarPlaceholder>
              )}
              <AttendeeInfo>
                <AttendeeName>{attendee.name}</AttendeeName>
                <AttendeeJoinDate>Joined {formatDate(attendee.joinedDate)}</AttendeeJoinDate>
              </AttendeeInfo>
              <StatusBadge status={attendee.status}>
                {attendee.status === 'confirmed' ? (
                  <>
                    <UserCheck />
                    Confirmed
                  </>
                ) : attendee.status === 'declined' ? (
                  <>
                    <UserX />
                    Declined
                  </>
                ) : (
                  <>
                    <Users />
                    Pending
                  </>
                )}
              </StatusBadge>
              {isOrganizer && (
                <ActionButtons>
                  <IconButton
                    onClick={() => alert('Feature coming soon')}
                    title="View profile"
                  >
                    <Users />
                  </IconButton>
                  <IconButton
                    onClick={() => alert('Feature coming soon')}
                    title="Remove attendee"
                  >
                    <UserX />
                  </IconButton>
                </ActionButtons>
              )}
            </AttendeeItem>
          ))}
        </AttendeeList>
      ) : (
        <EmptyState>No attendees yet</EmptyState>
      )}
    </AttendeeContainer>
  );
};

export default EventAttendees;
