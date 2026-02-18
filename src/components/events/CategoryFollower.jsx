'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Star, Users } from 'lucide-react';
import {
  useFollowCategory,
  useUnfollowCategory,
  useFollowedCategories,
} from '@/hooks/useCategoryTag';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const FollowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${props => (props.compact ? '6px 10px' : '8px 14px')};
  background: ${props =>
    props.isFollowing
      ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
      : '#f9fafb'};
  color: ${props => (props.isFollowing ? 'white' : '#4f46e5')};
  border: 1px solid ${props => (props.isFollowing ? 'transparent' : '#d1d5db')};
  border-radius: 6px;
  font-size: ${props => (props.compact ? '12px' : '13px')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  svg {
    width: ${props => (props.compact ? '14px' : '16px')};
    height: ${props => (props.compact ? '14px' : '16px')};
  }

  &:hover {
    ${props =>
      props.isFollowing
        ? `
        background: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
        box-shadow: 0 4px 12px rgba(249, 158, 11, 0.3);
      `
        : `
        background: #f3f4f6;
        border-color: #4f46e5;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
      `}
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: ${props => (props.compact ? '7px 12px' : '10px 16px')};
    font-size: ${props => (props.compact ? '13px' : '14px')};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;

  svg {
    width: 16px;
    height: 16px;
    color: #999;
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const CategoryFollower = ({
  categoryId,
  categoryName = 'Category',
  followerCount = 0,
  compact = false,
  showStats = true,
  onFollowChange,
}) => {
  const { mutate: followCategory, isPending: isFollowing } =
    useFollowCategory();
  const { mutate: unfollowCategory, isPending: isUnfollowing } =
    useUnfollowCategory();
  const { data: followedCategories = [] } = useFollowedCategories();

  const [localFollowerCount, setLocalFollowerCount] = useState(followerCount);

  const isUserFollowing = followedCategories.some(
    cat => cat._id === categoryId || cat.id === categoryId
  );

  const handleFollowToggle = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (isUserFollowing) {
      unfollowCategory(
        { categoryId },
        {
          onSuccess: () => {
            setLocalFollowerCount(prev => Math.max(0, prev - 1));
            onFollowChange?.(false);
          },
        }
      );
    } else {
      followCategory(
        { categoryId },
        {
          onSuccess: () => {
            setLocalFollowerCount(prev => prev + 1);
            onFollowChange?.(true);
          },
        }
      );
    }
  };

  const isLoading = isFollowing || isUnfollowing;

  return (
    <Container>
      <FollowButton
        onClick={handleFollowToggle}
        isFollowing={isUserFollowing}
        compact={compact}
        disabled={isLoading}
        title={
          isUserFollowing
            ? `Unfollow ${categoryName}`
            : `Follow ${categoryName}`
        }
      >
        <Star fill={isUserFollowing ? 'currentColor' : 'none'} />
        <span>
          {isLoading ? 'Loading...' : isUserFollowing ? 'Following' : 'Follow'}
        </span>
      </FollowButton>

      {showStats && (
        <StatsContainer>
          <Users />
          <span>{localFollowerCount}</span>
        </StatsContainer>
      )}
    </Container>
  );
};

export default CategoryFollower;
