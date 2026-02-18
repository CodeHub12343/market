'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Share2, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import EventShareModal from './EventShareModal';
import { useCopyEventLink } from '@/hooks/useEventSharing';

const ShareButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ShareButtonStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 13px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
  transition: all 0.2s ease;
  z-index: 100;
  min-width: 220px;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #667eea;
    flex-shrink: 0;
  }

  &:hover {
    background: #f9fafb;
  }

  &:active {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: ${props => props.type === 'success' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.type === 'success' ? '#15803d' : '#991b1b'};
  border: 1px solid ${props => props.type === 'success' ? '#bbf7d0' : '#fecaca'};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
`;

const EventShareDropdown = ({ event = {} }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ type: 'success', message: '', isVisible: false });

  const copyLink = useCopyEventLink();

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ type, message, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, duration);
  };

  const handleCopyLink = async () => {
    try {
      const result = await copyLink.mutateAsync(event._id);
      if (result.success) {
        showToast('Event link copied to clipboard', 'success');
      }
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
    setIsDropdownOpen(false);
  };

  const handleOpenModal = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ShareButtonContainer>
      <ShareButtonStyle
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title="Share this event"
      >
        <Share2 />
        <span>Share</span>
      </ShareButtonStyle>

      <Dropdown isOpen={isDropdownOpen}>
        <DropdownItem onClick={handleCopyLink} disabled={copyLink.isPending}>
          <Copy />
          Copy Link
        </DropdownItem>
        <DropdownItem onClick={handleOpenModal}>
          <Share2 />
          More Options
        </DropdownItem>
      </Dropdown>

      <EventShareModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={event}
      />

      <Toast type={toast.type} isVisible={toast.isVisible}>
        {toast.type === 'success' ? <CheckCircle /> : <AlertCircle />}
        {toast.message}
      </Toast>
    </ShareButtonContainer>
  );
};

export default EventShareDropdown;
