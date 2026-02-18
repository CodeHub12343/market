/**
 * useProfileStats Hook - Fetch user profile statistics
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import * as profileService from '@/services/profile';
import { useAuth } from './useAuth';

export const useProfileStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['profileStats', user?._id],
    queryFn: () =>
      profileService.getProfileStats().then(res => res.data.data.stats),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    stats: stats || {
      totalPosts: 0,
      totalFollowers: 0,
      totalFollowing: 0,
      totalReviews: 0,
      accountAge: '0 days',
      profileCompletion: 0
    },
    isLoading,
    error,
    refetch
  };
};
