/**
 * FollowButton Component - Follow/Unfollow user
 */

'use client';

import styled from 'styled-components';
import { FaUserCheck, FaUserPlus, FaSpinner } from 'react-icons/fa';
import { useFollowUser } from '@/hooks/useFollowing';
import { useState, useEffect } from 'react';

const Button = styled.button`
  background: ${props => props.isFollowing ? '#f0f0f0' : '#667eea'};
  color: ${props => props.isFollowing ? '#333' : 'white'};
  border: ${props => props.isFollowing ? '2px solid #667eea' : 'none'};
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background: ${props => props.isFollowing ? '#e0e0e0' : '#5568d3'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FollowButton = ({ userId, initialFollowing = false, onFollowChange }) => {
  const { follow, unfollow, isFollowing, isUnfollowing } = useFollowUser();
  const [isUserFollowing, setIsUserFollowing] = useState(initialFollowing);
  const isLoading = isFollowing || isUnfollowing;

  useEffect(() => {
    setIsUserFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleFollowClick = async () => {
    try {
      if (isUserFollowing) {
        await unfollow(userId);
        setIsUserFollowing(false);
      } else {
        await follow(userId);
        setIsUserFollowing(true);
      }
      onFollowChange?.(userId, !isUserFollowing);
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  return (
    <Button
      onClick={handleFollowClick}
      disabled={isLoading}
      isFollowing={isUserFollowing}
    >
      {isLoading && <FaSpinner className="spin" />}
      {!isLoading && (isUserFollowing ? <FaUserCheck /> : <FaUserPlus />)}
      {isUserFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
