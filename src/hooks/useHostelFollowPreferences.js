'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  followHostel,
  unfollowHostel,
  isFollowingHostel,
  getFollowingHostels,
  getNotificationPreferences,
  updateNotificationPreferences,
  getAllNotificationPreferences,
  updateGlobalNotificationSettings,
  getFollowersCount,
  getFollowingStats,
  markNotificationsAsRead,
  muteHostelNotifications,
  unmuteHostelNotifications,
  getNotificationHistory
} from '@/services/hostelNotificationPreferences';

const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,     // 30 minutes
  LONG: 60 * 60 * 1000,       // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Check if user follows a hostel
 */
export const useIsFollowingHostel = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['is-following-hostel', hostelId],
    queryFn: () => isFollowingHostel(hostelId),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};

/**
 * Follow a hostel mutation
 */
export const useFollowHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostelId) => followHostel(hostelId),
    onSuccess: (_, hostelId) => {
      // Invalidate follow status
      queryClient.invalidateQueries({
        queryKey: ['is-following-hostel', hostelId]
      });
      // Invalidate following list
      queryClient.invalidateQueries({
        queryKey: ['following-hostels']
      });
      // Invalidate followers count
      queryClient.invalidateQueries({
        queryKey: ['followers-count', hostelId]
      });
    }
  });
};

/**
 * Unfollow a hostel mutation
 */
export const useUnfollowHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostelId) => unfollowHostel(hostelId),
    onSuccess: (_, hostelId) => {
      // Invalidate follow status
      queryClient.invalidateQueries({
        queryKey: ['is-following-hostel', hostelId]
      });
      // Invalidate following list
      queryClient.invalidateQueries({
        queryKey: ['following-hostels']
      });
      // Invalidate followers count
      queryClient.invalidateQueries({
        queryKey: ['followers-count', hostelId]
      });
    }
  });
};

/**
 * Get user's following hostels
 */
export const useFollowingHostels = (page = 1, enabled = true) => {
  return useQuery({
    queryKey: ['following-hostels', page],
    queryFn: () => getFollowingHostels(page),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get notification preferences for a hostel
 */
export const useNotificationPreferences = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['notification-preferences', hostelId],
    queryFn: () => getNotificationPreferences(hostelId),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};

/**
 * Update notification preferences for a hostel
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostelId, preferences }) =>
      updateNotificationPreferences(hostelId, preferences),
    onSuccess: (_, { hostelId }) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-preferences', hostelId]
      });
    }
  });
};

/**
 * Get all user notification preferences
 */
export const useAllNotificationPreferences = (enabled = true) => {
  return useQuery({
    queryKey: ['all-notification-preferences'],
    queryFn: () => getAllNotificationPreferences(),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Update global notification settings
 */
export const useUpdateGlobalNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) => updateGlobalNotificationSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['all-notification-preferences']
      });
    }
  });
};

/**
 * Get hostel followers count
 */
export const useFollowersCount = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['followers-count', hostelId],
    queryFn: () => getFollowersCount(hostelId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};

/**
 * Get hostel following stats
 */
export const useFollowingStats = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['following-stats', hostelId],
    queryFn: () => getFollowingStats(hostelId),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};

/**
 * Mark notifications as read for a hostel
 */
export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostelId) => markNotificationsAsRead(hostelId),
    onSuccess: (_, hostelId) => {
      queryClient.invalidateQueries({
        queryKey: ['following-stats', hostelId]
      });
      queryClient.invalidateQueries({
        queryKey: ['notification-history', hostelId]
      });
    }
  });
};

/**
 * Mute hostel notifications
 */
export const useMuteHostelNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostelId, duration }) =>
      muteHostelNotifications(hostelId, duration),
    onSuccess: (_, { hostelId }) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-preferences', hostelId]
      });
    }
  });
};

/**
 * Unmute hostel notifications
 */
export const useUnmuteHostelNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostelId) => unmuteHostelNotifications(hostelId),
    onSuccess: (_, hostelId) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-preferences', hostelId]
      });
    }
  });
};

/**
 * Get notification history for a hostel
 */
export const useNotificationHistory = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['notification-history', hostelId],
    queryFn: () => getNotificationHistory(hostelId),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};
