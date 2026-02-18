'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { X, Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { useNotificationPreferences, useUpdateNotificationPreferences, useMuteHostelNotifications, useUnmuteHostelNotifications } from '@/hooks/useHostelFollowPreferences';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  padding: 20px;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 20px;
    height: 20px;
    color: #0369a1;
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #f3f4f6;
    color: #1a1a1a;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const SectionDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const PreferenceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PreferenceItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }

  input {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const PreferenceLabel = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;

  .preference-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .preference-desc {
    font-size: 12px;
    color: #666;
  }
`;

const ChannelSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ChannelOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &:hover {
    background: #f0f9ff;
    border-color: #bfdbfe;
  }

  ${props => props.checked && `
    background: #f0f9ff;
    border-color: #0369a1;
  `}
`;

const ChannelLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
    color: #0369a1;
  }
`;

const MuteSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 10px;
`;

const MuteLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
`;

const MuteButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const MuteBtn = styled.button`
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fcd34d;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #1a1a1a;
        color: white;

        &:hover {
          background: #000;
        }
      `;
    }
    return `
      background: #f3f4f6;
      color: #1a1a1a;
      border: 1px solid #e5e7eb;

      &:hover {
        background: #e5e7eb;
      }
    `;
  }}
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin-top: 8px;
`;

export default function NotificationPreferencesModal({ isOpen, onClose, hostelId }) {
  const { data: preferences = {}, isLoading } = useNotificationPreferences(hostelId, isOpen);
  const updateMutation = useUpdateNotificationPreferences();
  const muteMutation = useMuteHostelNotifications();
  const unmuteMutation = useUnmuteHostelNotifications();

  const [localPreferences, setLocalPreferences] = useState({
    priceUpdates: true,
    availabilityChanges: true,
    newReviews: true,
    roomAvailability: true,
    hostelUpdates: true,
    email: true,
    push: true,
    sms: false
  });

  useEffect(() => {
    if (preferences && Object.keys(preferences).length > 0) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        hostelId,
        preferences: localPreferences
      });
      onClose();
    } catch (error) {
      alert(error || 'Failed to save preferences');
    }
  };

  const handleMute = async (duration) => {
    try {
      await muteMutation.mutateAsync({ hostelId, duration });
      onClose();
    } catch (error) {
      alert(error || 'Failed to mute notifications');
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Bell />
            Notification Settings
          </Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        {isLoading ? (
          <LoadingText>Loading preferences...</LoadingText>
        ) : (
          <>
            {/* Notification Types */}
            <Section>
              <SectionTitle>What to notify me about</SectionTitle>
              <SectionDescription>Choose which hostel updates you want to be notified about</SectionDescription>
              <PreferenceGroup>
                <PreferenceItem>
                  <input
                    type="checkbox"
                    checked={localPreferences.priceUpdates}
                    onChange={() => handleToggle('priceUpdates')}
                  />
                  <PreferenceLabel>
                    <span className="preference-name">Price Updates</span>
                    <span className="preference-desc">When room prices change</span>
                  </PreferenceLabel>
                </PreferenceItem>

                <PreferenceItem>
                  <input
                    type="checkbox"
                    checked={localPreferences.availabilityChanges}
                    onChange={() => handleToggle('availabilityChanges')}
                  />
                  <PreferenceLabel>
                    <span className="preference-name">Availability Changes</span>
                    <span className="preference-desc">When hostel availability updates</span>
                  </PreferenceLabel>
                </PreferenceItem>

                <PreferenceItem>
                  <input
                    type="checkbox"
                    checked={localPreferences.roomAvailability}
                    onChange={() => handleToggle('roomAvailability')}
                  />
                  <PreferenceLabel>
                    <span className="preference-name">Room Availability</span>
                    <span className="preference-desc">When specific rooms become available</span>
                  </PreferenceLabel>
                </PreferenceItem>

                <PreferenceItem>
                  <input
                    type="checkbox"
                    checked={localPreferences.newReviews}
                    onChange={() => handleToggle('newReviews')}
                  />
                  <PreferenceLabel>
                    <span className="preference-name">New Reviews</span>
                    <span className="preference-desc">When reviews are posted</span>
                  </PreferenceLabel>
                </PreferenceItem>

                <PreferenceItem>
                  <input
                    type="checkbox"
                    checked={localPreferences.hostelUpdates}
                    onChange={() => handleToggle('hostelUpdates')}
                  />
                  <PreferenceLabel>
                    <span className="preference-name">Hostel Updates</span>
                    <span className="preference-desc">News and important announcements</span>
                  </PreferenceLabel>
                </PreferenceItem>
              </PreferenceGroup>
            </Section>

            {/* Notification Channels */}
            <Section>
              <SectionTitle>How to notify me</SectionTitle>
              <SectionDescription>Select your preferred notification channels</SectionDescription>
              <ChannelSelector>
                <ChannelOption>
                  <input
                    type="checkbox"
                    checked={localPreferences.push}
                    onChange={() => handleToggle('push')}
                  />
                  <ChannelLabel>
                    <Smartphone />
                    Push
                  </ChannelLabel>
                </ChannelOption>

                <ChannelOption>
                  <input
                    type="checkbox"
                    checked={localPreferences.email}
                    onChange={() => handleToggle('email')}
                  />
                  <ChannelLabel>
                    <Mail />
                    Email
                  </ChannelLabel>
                </ChannelOption>

                <ChannelOption>
                  <input
                    type="checkbox"
                    checked={localPreferences.sms}
                    onChange={() => handleToggle('sms')}
                  />
                  <ChannelLabel>
                    <MessageSquare />
                    SMS
                  </ChannelLabel>
                </ChannelOption>
              </ChannelSelector>
            </Section>

            {/* Mute Option */}
            <Section>
              <SectionTitle>Temporarily mute</SectionTitle>
              <SectionDescription>Stop receiving notifications for a while</SectionDescription>
              <MuteSection>
                <MuteLabel>Mute for:</MuteLabel>
                <MuteButtons>
                  <MuteBtn onClick={() => handleMute('1h')} disabled={muteMutation.isPending}>
                    1 Hour
                  </MuteBtn>
                  <MuteBtn onClick={() => handleMute('1d')} disabled={muteMutation.isPending}>
                    1 Day
                  </MuteBtn>
                  <MuteBtn onClick={() => handleMute('1w')} disabled={muteMutation.isPending}>
                    1 Week
                  </MuteBtn>
                </MuteButtons>
              </MuteSection>
            </Section>

            {/* Action Buttons */}
            <ActionButtons>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </ActionButtons>

            {updateMutation.isError && (
              <ErrorText>{updateMutation.error?.message || 'Failed to save preferences'}</ErrorText>
            )}
          </>
        )}
      </Modal>
    </Overlay>
  );
}
