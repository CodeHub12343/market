'use client';

import styled from 'styled-components';
import { Heart, Bell, BellOff } from 'lucide-react';
import { useState } from 'react';
import { useIsFollowingHostel, useFollowHostel, useUnfollowHostel, useFollowersCount } from '@/hooks/useHostelFollowPreferences';
import { useAuth } from '@/hooks/useAuth';
import NotificationPreferencesModal from './NotificationPreferencesModal';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FollowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isFollowing ? '#f0f9ff' : '#1a1a1a'};
  color: ${props => props.isFollowing ? '#0369a1' : '#ffffff'};
  border: ${props => props.isFollowing ? '1px solid #bfdbfe' : 'none'};

  svg {
    width: 16px;
    height: 16px;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 12px 18px;
    font-size: 14px;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      ${props => props.isFollowing 
        ? 'background: #e0f2fe; border-color: #7dd3fc;'
        : 'background: #000; box-shadow: 0 8px 16px rgba(26, 26, 26, 0.2);'
      }
    }
  }
`;

const PreferencesBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1a1a1a;

  svg {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      border-color: #1a1a1a;
      background: #f9f9f9;
    }
  }
`;

const FollowersCount = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
  padding: 0 8px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const LoginPrompt = styled.div`
  font-size: 12px;
  color: #999;
`;

export default function FollowButton({ hostelId, size = 'medium', showLabel = true, showPreferences = true, variant = 'default' }) {
  const { user } = useAuth();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  const { data: isFollowing = false, isLoading: isCheckingFollow } = useIsFollowingHostel(
    hostelId,
    !!user && !!hostelId
  );
  const { data: followersCount = 0 } = useFollowersCount(hostelId, !!hostelId);
  
  const followMutation = useFollowHostel();
  const unfollowMutation = useUnfollowHostel();

  const isLoading = isCheckingFollow || followMutation.isPending || unfollowMutation.isPending;

  const handleFollowClick = async () => {
    if (!user) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(hostelId);
      } else {
        await followMutation.mutateAsync(hostelId);
      }
    } catch (error) {
      alert(error || 'Failed to update follow status');
    }
  };

  if (!user) {
    return <LoginPrompt>Sign in to follow</LoginPrompt>;
  }

  return (
    <>
      <Container>
        <FollowBtn
          isFollowing={isFollowing}
          onClick={handleFollowClick}
          disabled={isLoading}
          title={isFollowing ? 'Unfollow this hostel' : 'Follow this hostel'}
        >
          <Heart fill={isFollowing ? 'currentColor' : 'none'} />
          {showLabel && (isFollowing ? 'Following' : 'Follow')}
        </FollowBtn>

        {isFollowing && showPreferences && (
          <PreferencesBtn
            onClick={() => setIsPreferencesOpen(true)}
            disabled={isLoading}
            title="Notification preferences"
            aria-label="Notification preferences"
          >
            <Bell />
          </PreferencesBtn>
        )}

        {followersCount > 0 && (
          <FollowersCount>{followersCount} followers</FollowersCount>
        )}
      </Container>

      {isFollowing && (
        <NotificationPreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          hostelId={hostelId}
        />
      )}
    </>
  );
}
