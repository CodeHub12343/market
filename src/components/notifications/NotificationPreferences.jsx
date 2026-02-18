'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, Mail, Smartphone, Save, RotateCcw } from 'lucide-react';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/useNotifications';

const PreferencesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 32px;
    gap: 32px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 32px;
    }
  }

  p {
    font-size: 14px;
    color: #666;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }
`;

const PreferenceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  @media (min-width: 768px) {
    padding: 24px;
    gap: 18px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #4f46e5;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 17px;
    }
  }
`;

const PreferenceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const PreferenceLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  flex: 1;
`;

const PreferenceTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const PreferenceDescription = styled.span`
  font-size: 12px;
  color: #999;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const Toggle = styled.input`
  cursor: pointer;
  width: 44px;
  height: 24px;
  accent-color: #4f46e5;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 10px 14px;
  }
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #666;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    gap: 16px;
    padding-top: 20px;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  ${props => props.variant === 'secondary' ? `
    background: white;
    border: 1px solid #e5e7eb;
    color: #666;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      color: #1a1a1a;
    }
  ` : `
    background: #4f46e5;
    color: white;

    &:hover {
      background: #3730a3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
  font-size: 14px;
  font-weight: 500;

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 15px;
  }
`;

const NotificationPreferences = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [localPrefs, setLocalPrefs] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    updatePreferences.mutate(localPrefs, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    });
  };

  const handleReset = () => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  };

  if (isLoading) {
    return (
      <PreferencesContainer>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Loading preferences...
        </div>
      </PreferencesContainer>
    );
  }

  return (
    <PreferencesContainer>
      <PageHeader>
        <h1>Notification Preferences</h1>
        <p>Control how and when you receive notifications</p>
      </PageHeader>

      {showSuccess && (
        <SuccessMessage>
          ✓ Preferences saved successfully
        </SuccessMessage>
      )}

      {/* Notification Types */}
      <PreferenceSection>
        <SectionHeader>
          <Bell />
          <h2>Notification Types</h2>
        </SectionHeader>

        <PreferenceGroup>
          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Event Reminders</PreferenceTitle>
              <PreferenceDescription>Reminders before your events start</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.eventReminders || false}
              onChange={() => handleToggle('eventReminders')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Event Updates</PreferenceTitle>
              <PreferenceDescription>When event details change</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.eventUpdates || false}
              onChange={() => handleToggle('eventUpdates')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>New Comments</PreferenceTitle>
              <PreferenceDescription>When someone comments on your events</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.comments || false}
              onChange={() => handleToggle('comments')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Comment Replies</PreferenceTitle>
              <PreferenceDescription>When someone replies to your comment</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.replies || false}
              onChange={() => handleToggle('replies')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Attendee Joined</PreferenceTitle>
              <PreferenceDescription>When someone joins your event (organizers only)</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.attendeeJoined || false}
              onChange={() => handleToggle('attendeeJoined')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Event Cancelled</PreferenceTitle>
              <PreferenceDescription>When an event you joined is cancelled</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.eventCancelled || false}
              onChange={() => handleToggle('eventCancelled')}
            />
          </PreferenceItem>
        </PreferenceGroup>
      </PreferenceSection>

      {/* Delivery Channels */}
      <PreferenceSection>
        <SectionHeader>
          <Mail />
          <h2>Delivery Channels</h2>
        </SectionHeader>

        <PreferenceGroup>
          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Email Notifications</PreferenceTitle>
              <PreferenceDescription>Receive notifications via email</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.emailNotifications || false}
              onChange={() => handleToggle('emailNotifications')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>Push Notifications</PreferenceTitle>
              <PreferenceDescription>Browser push notifications</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.pushNotifications || false}
              onChange={() => handleToggle('pushNotifications')}
            />
          </PreferenceItem>

          <PreferenceItem>
            <PreferenceLabel>
              <PreferenceTitle>In-App Notifications</PreferenceTitle>
              <PreferenceDescription>Notifications in the app</PreferenceDescription>
            </PreferenceLabel>
            <Toggle
              type="checkbox"
              checked={localPrefs.inAppNotifications || false}
              onChange={() => handleToggle('inAppNotifications')}
            />
          </PreferenceItem>
        </PreferenceGroup>
      </PreferenceSection>

      {/* Notification Timing */}
      <PreferenceSection>
        <SectionHeader>
          <Smartphone />
          <h2>Notification Timing</h2>
        </SectionHeader>

        <PreferenceGroup>
          <SelectGroup>
            <SelectLabel>Event Reminder Time</SelectLabel>
            <Select
              value={localPrefs.reminderTime || '1day'}
              onChange={(e) => handleSelectChange('reminderTime', e.target.value)}
            >
              <option value="1hour">1 hour before</option>
              <option value="2hours">2 hours before</option>
              <option value="6hours">6 hours before</option>
              <option value="1day">1 day before</option>
            </Select>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Notification Frequency</SelectLabel>
            <Select
              value={localPrefs.frequency || 'instant'}
              onChange={(e) => handleSelectChange('frequency', e.target.value)}
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Digest</option>
            </Select>
          </SelectGroup>
        </PreferenceGroup>
      </PreferenceSection>

      {/* Action Buttons */}
      <ButtonGroup>
        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={updatePreferences.isPending}
        >
          <RotateCcw />
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={updatePreferences.isPending}
        >
          <Save />
          Save Preferences
        </Button>
      </ButtonGroup>
    </PreferencesContainer>
  );
};

export default NotificationPreferences;
