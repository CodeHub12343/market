/**
 * useProfile Hook - Fetch and manage user profile
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import * as profileService from '@/services/profile';
import { useAuth } from './useAuth';

export const useProfile = (userId = null) => {
  const { user: currentUser } = useAuth();
  const targetUserId = userId || currentUser?._id;

  const { data: profile, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: () => {
      if (!targetUserId) throw new Error('No user ID');
      
      // If fetching own profile, use /me endpoint
      if (targetUserId === currentUser?._id) {
        return profileService.getMyProfile().then(res => {
          // Handle different response structures
          return res.data.data?.user || res.data.user || res.data.data || res.data;
        });
      }
      
      // Otherwise fetch public profile
      return profileService.getUserProfile(targetUserId).then(res => {
        // Handle different response structures
        return res.data.data?.user || res.data.user || res.data.data || res.data;
      });
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    profile: profile || null,
    isLoading,
    isError,
    error,
    refetch
  };
};

export const useMyProfile = () => useProfile();
