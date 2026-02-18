'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  generateEventQRCode,
  copyEventLinkToClipboard,
  downloadICalendar,
  getGoogleCalendarUrl,
  shareToSocialMedia,
  inviteFriendsViaEmail,
  logEventShare,
  getEventShareStats,
  getEventShareUrl
} from '@/services/eventSharingService';

/**
 * Generate QR code for event
 */
export const useGenerateEventQR = (eventId, size = 300, enabled = true) => {
  return useQuery({
    queryKey: ['event-qr-code', eventId],
    queryFn: () => generateEventQRCode(eventId, size),
    enabled
  });
};

/**
 * Copy event link to clipboard
 */
export const useCopyEventLink = () => {
  return useMutation({
    mutationFn: (eventId) => copyEventLinkToClipboard(eventId)
  });
};

/**
 * Download iCalendar file
 */
export const useDownloadCalendar = () => {
  return useMutation({
    mutationFn: (event) => downloadICalendar(event)
  });
};

/**
 * Get Google Calendar URL
 */
export const useGetGoogleCalendarUrl = (event, enabled = true) => {
  return useQuery({
    queryKey: ['google-calendar-url', event?._id],
    queryFn: () => getGoogleCalendarUrl(event),
    staleTime: Infinity, // URL doesn't change
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!event && enabled,
    retry: 1
  });
};

/**
 * Share to social media
 */
export const useShareToSocial = () => {
  return useMutation({
    mutationFn: ({ platform, event }) => {
      // Log the share action
      logEventShare(event._id, platform);
      // Return the share result
      return Promise.resolve(shareToSocialMedia(platform, event));
    }
  });
};

/**
 * Invite friends via email
 */
export const useInviteFriends = () => {
  return useMutation({
    mutationFn: ({ eventId, emails, message }) =>
      inviteFriendsViaEmail(eventId, emails, message)
  });
};

/**
 * Get event share statistics
 */
export const useEventShareStats = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-share-stats', eventId],
    queryFn: () => getEventShareStats(eventId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Get event share URL
 */
export const useEventShareUrl = (eventId) => {
  return getEventShareUrl(eventId);
};
