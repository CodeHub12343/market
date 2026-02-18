'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationPreferences,
  updateNotificationPreferences,
  subscribeToNotifications
} from '@/services/notificationService';

const CACHE_TIMES = {
  SHORT: 30 * 1000,           // 30 seconds - real-time unread count
  MEDIUM: 2 * 60 * 1000,      // 2 minutes - notifications list
  LONG: 10 * 60 * 1000        // 10 minutes - preferences
};

/**
 * Get paginated notifications
 */
export const useNotifications = (limit = 20, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 0 }) => getNotifications(limit, pageParam),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === limit ? pages.length * limit : undefined,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get unread notification count
 */
export const useUnreadCount = (enabled = true, refetchInterval = 30000) => {
  return useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: () => getUnreadCount(),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    refetchInterval,
    retry: 1
  });
};

/**
 * Get unread notifications
 */
export const useUnreadNotifications = (limit = 50, enabled = true) => {
  return useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => getUnreadNotifications(limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Mark notification as read (mutation)
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate both unread count and notifications
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    }
  });
};

/**
 * Mark all notifications as read (mutation, non-blocking)
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    }
  });
};

/**
 * Delete a single notification (mutation)
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    }
  });
};

/**
 * Delete all notifications (mutation)
 */
export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    }
  });
};

/**
 * Get notification preferences
 */
export const useNotificationPreferences = (enabled = true) => {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => getNotificationPreferences(),
    staleTime: CACHE_TIMES.LONG,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled,
    retry: 1
  });
};

/**
 * Update notification preferences (mutation)
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preferences) => updateNotificationPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    }
  });
};

/**
 * Subscribe to real-time notifications
 * Use in useEffect
 */
export const useNotificationSubscription = (callback, enabled = true) => {
  const [ws, setWs] = React.useState(null);

  React.useEffect(() => {
    if (!enabled) return;

    const webSocket = subscribeToNotifications(callback);
    setWs(webSocket);

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [callback, enabled]);

  return ws;
};

// For client-side imports
import React from 'react';
