'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  X,
  Copy,
  QrCode,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  useCopyEventLink,
  useGenerateEventQR,
  useDownloadCalendar,
  useShareToSocial,
  useInviteFriends,
  useGetGoogleCalendarUrl
} from '@/hooks/useEventSharing';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    align-items: center;
    justify-content: center;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  animation: ${props => props.isOpen ? 'slideUp 0.3s ease' : 'slideDown 0.3s ease'};

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  @media (min-width: 769px) {
    max-width: 500px;
    max-height: 80vh;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #999;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ShareSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (min-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ShareButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 600;
  color: #333;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 500px) {
    font-size: 13px;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  color: #666;
  background: #f9fafb;
  border: 1px solid #e5e7eb;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  @media (min-width: 500px) {
    font-size: 13px;
  }
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #3730a3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 500px) {
    font-size: 14px;
  }
`;

const QRCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

const QRImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const QRLoading = styled.div`
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const InviteSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InviteInput = styled.input`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  @media (min-width: 500px) {
    font-size: 14px;
  }
`;

const InviteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3730a3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => props.type === 'success' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.type === 'success' ? '#15803d' : '#991b1b'};
  border: 1px solid ${props => props.type === 'success' ? '#bbf7d0' : '#fecaca'};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const EventShareModal = ({ isOpen = false, onClose = () => {}, event = {} }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [showMessage, setShowMessage] = useState(null);

  const copyLink = useCopyEventLink();
  const { data: qrCode, isLoading: qrLoading } = useGenerateEventQR(event._id, 250, isOpen);
  const downloadCalendar = useDownloadCalendar();
  const shareToSocial = useShareToSocial();
  const inviteFriends = useInviteFriends();
  const { data: googleCalendarUrl } = useGetGoogleCalendarUrl(event, isOpen);

  const handleCopyLink = async () => {
    const result = await copyLink.mutateAsync(event._id);
    if (result.success) {
      setShowMessage({ type: 'success', text: 'Link copied to clipboard' });
      setTimeout(() => setShowMessage(null), 3000);
    }
  };

  const handleShare = (platform) => {
    shareToSocial.mutate(
      { platform, event },
      {
        onSuccess: () => {
          setShowMessage({ type: 'success', text: `Shared to ${platform}` });
          setTimeout(() => setShowMessage(null), 2000);
        }
      }
    );
  };

  const handleDownloadCalendar = async () => {
    const result = await downloadCalendar.mutateAsync(event);
    if (result.success) {
      setShowMessage({ type: 'success', text: 'Calendar file downloaded' });
      setTimeout(() => setShowMessage(null), 3000);
    }
  };

  const handleGoogleCalendar = () => {
    if (googleCalendarUrl) {
      window.open(googleCalendarUrl, '_blank');
      setShowMessage({ type: 'success', text: 'Opening Google Calendar' });
      setTimeout(() => setShowMessage(null), 2000);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setShowMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    inviteFriends.mutate(
      { eventId: event._id, emails: inviteEmail.split(',').map(e => e.trim()) },
      {
        onSuccess: () => {
          setShowMessage({ type: 'success', text: 'Invites sent successfully' });
          setInviteEmail('');
          setTimeout(() => setShowMessage(null), 3000);
        },
        onError: () => {
          setShowMessage({ type: 'error', text: 'Failed to send invites' });
          setTimeout(() => setShowMessage(null), 3000);
        }
      }
    );
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContent isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Share Event</Title>
          <CloseButton onClick={onClose} title="Close">
            <X />
          </CloseButton>
        </Header>

        <Content>
          {showMessage && (
            <Message type={showMessage.type}>
              {showMessage.type === 'success' ? <CheckCircle /> : <AlertCircle />}
              {showMessage.text}
            </Message>
          )}

          {/* Copy Link Section */}
          <ShareSection>
            <SectionTitle>Share Link</SectionTitle>
            <LinkContainer>
              <LinkInput
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/events/${event._id}`}
                readOnly
              />
              <CopyButton onClick={handleCopyLink} disabled={copyLink.isPending}>
                <Copy />
                Copy
              </CopyButton>
            </LinkContainer>
          </ShareSection>

          {/* Social Media Sharing */}
          <ShareSection>
            <SectionTitle>Share on Social Media</SectionTitle>
            <ShareGrid>
              <ShareButton
                onClick={() => handleShare('facebook')}
                disabled={shareToSocial.isPending}
                title="Share on Facebook"
              >
                <Facebook />
                Facebook
              </ShareButton>
              <ShareButton
                onClick={() => handleShare('twitter')}
                disabled={shareToSocial.isPending}
                title="Share on Twitter"
              >
                <Twitter />
                Twitter
              </ShareButton>
              <ShareButton
                onClick={() => handleShare('linkedin')}
                disabled={shareToSocial.isPending}
                title="Share on LinkedIn"
              >
                <Linkedin />
                LinkedIn
              </ShareButton>
              <ShareButton
                onClick={() => handleShare('whatsapp')}
                disabled={shareToSocial.isPending}
                title="Share on WhatsApp"
              >
                <MessageCircle />
                WhatsApp
              </ShareButton>
            </ShareGrid>
          </ShareSection>

          {/* QR Code */}
          <ShareSection>
            <SectionTitle>QR Code</SectionTitle>
            <QRCodeSection>
              {qrLoading ? (
                <QRLoading>Generating QR code...</QRLoading>
              ) : qrCode ? (
                <QRImage src={qrCode} alt="Event QR Code" />
              ) : (
                <QRLoading>Failed to generate QR code</QRLoading>
              )}
            </QRCodeSection>
          </ShareSection>

          {/* Calendar Export */}
          <ShareSection>
            <SectionTitle>Add to Calendar</SectionTitle>
            <ShareGrid style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <DownloadButton
                onClick={handleDownloadCalendar}
                disabled={downloadCalendar.isPending}
              >
                <Calendar />
                iCalendar
              </DownloadButton>
              <DownloadButton
                onClick={handleGoogleCalendar}
                disabled={!googleCalendarUrl}
              >
                <Calendar />
                Google
              </DownloadButton>
            </ShareGrid>
          </ShareSection>

          {/* Invite Friends */}
          <ShareSection>
            <SectionTitle>Invite Friends</SectionTitle>
            <InviteInput
              type="email"
              placeholder="Enter email(s) separated by commas"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <InviteButton
              onClick={handleInvite}
              disabled={inviteFriends.isPending}
            >
              <Mail />
              Send Invites
            </InviteButton>
          </ShareSection>
        </Content>
      </ModalContent>
    </Overlay>
  );
};

export default EventShareModal;
