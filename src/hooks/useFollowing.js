/**
 * useFollowing Hook - Manage following relationships
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as profileService from '@/services/profile';
import { useAuth } from './useAuth';

export const useFollowing = (userId) => {
  const queryClient = useQueryClient();

  const { data: following, isLoading, error } = useQuery({
    queryKey: ['following', userId],
    queryFn: () =>
      profileService.getFollowing(userId).then(res => res.data.data.following),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    following: following || [],
    isLoading,
    error,
    count: following?.length || 0
  };
};

export const useFollowers = (userId) => {
  const queryClient = useQueryClient();

  const { data: followers, isLoading, error } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () =>
      profileService.getFollowers(userId).then(res => res.data.data.followers),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    followers: followers || [],
    isLoading,
    error,
    count: followers?.length || 0
  };
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { mutateAsync: follow, isPending: isFollowing } = useMutation({
    mutationFn: (userId) => profileService.followUser(userId),
    onSuccess: (res, userId) => {
      console.log('✅ User followed successfully');
      
      // Invalidate following/followers lists
      queryClient.invalidateQueries({ queryKey: ['following', currentUser?._id] });
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
    },
    onError: (error) => {
      console.error('❌ Follow failed:', error?.response?.data?.message);
    }
  });

  const { mutateAsync: unfollow, isPending: isUnfollowing } = useMutation({
    mutationFn: (userId) => profileService.unfollowUser(userId),
    onSuccess: (res, userId) => {
      console.log('✅ User unfollowed successfully');
      
      // Invalidate following/followers lists
      queryClient.invalidateQueries({ queryKey: ['following', currentUser?._id] });
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
    },
    onError: (error) => {
      console.error('❌ Unfollow failed:', error?.response?.data?.message);
    }
  });

  return {
    follow,
    unfollow,
    isFollowing,
    isUnfollowing
  };
};
